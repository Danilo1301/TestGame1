import { AssetLoad } from "../../utils/assetLoad/assetLoad";
import { BaseObject } from "../../utils/baseObject";
import { Input } from "../../utils/input/input";
import { PhaserLoad } from "../../utils/phaserLoad/phaserLoad";
import { MainScene } from "../scenes/mainScene";
import { SongSelectionScene } from "../scenes/songSelectionScene";
import { ThreeScene } from "../../utils/three/threeScene";
import { SceneManager } from "./sceneManager";
import { AudioManager } from "../../utils/audioManager/audioManager";
import { EditorScene } from "../scenes/editor/editorScene";
import { GameScene } from "../scenes/gameScene/gameScene";
import { PreloadScene } from "../scenes/preloadScene";
import {
  getIsMobile,
  getQueryParams,
  getQueryParamsFromString,
} from "../../utils/utils";
import CryptoJS from "crypto-js";
import { Network } from "../network/network";
import {
  IPacketData_DataToStartGame,
  IPacketData_Event,
  IPacketData_ForceFinish,
  IPacketData_MatchStatusChange,
  IPacketData_StartGameData,
  PACKET_TYPE,
} from "../network/packet";
import { eGameEventType } from "../network/eGameEventType";
import { eMatchStatus, MatchData } from "./matchData";
import { GameLogic } from "./gameLogic";
import { SongManager } from "../songManager";
import { LoadScene } from "../scenes/loadScene";
import { gameSettings } from "../constants/gameSettings";

export class Gameface extends BaseObject {
  public static Instance: Gameface;
  public static isLowPerformance: boolean = true;
  public static isMobile: boolean = getIsMobile();

  public get phaser() {
    return this._phaser!;
  }
  public get sceneManager() {
    return this._sceneManager;
  }
  public get input() {
    return this._input;
  }
  public get network() {
    return this._network;
  }
  public get gameLogic() {
    return this._gameLogic;
  }
  public get songManager() {
    return this._songManager;
  }

  private _phaser?: Phaser.Game;
  private _sceneManager: SceneManager;
  private _input: Input;
  private _network: Network;
  private _gameLogic: GameLogic;
  private _songManager: SongManager;

  constructor() {
    super();

    Gameface.Instance = this;

    this._sceneManager = new SceneManager(this);
    this._input = new Input();
    this._network = new Network();
    this._gameLogic = new GameLogic();
    this._songManager = new SongManager();

    this._gameLogic.createPads();
  }

  public async start() {
    this.log("start");

    if (Gameface.isMobile) this.log("Is mobile");

    this._phaser = await PhaserLoad.loadAsync();

    this.log(this.phaser);

    await this.waitForPreloadScene();

    Gameface.setLoadingSpinnerVisible(false);

    this.sceneManager.startScene(MainScene);
    this.sceneManager.startScene(ThreeScene);

    this.input.init(MainScene.Instance);

    AssetLoad.addAssets();
    await AssetLoad.load();

    MainScene.Instance.createPlayButton();

    console.log(
      `\n\n\n\n%cGuitar Game\x1b[0m\nVocê encontrará algumas opções em window.game\n\n\n\n`,
      "background: #222; color: #bada55; font-size: 24px;"
    );

    
    const gameLogic = this.gameLogic;
    const matchData = gameLogic.matchData;
    const songId = this.gameLogic.matchData.songId;

    const song = this.songManager.getSong("song" + (parseInt(songId) + 1));

    console.log(`Song: ${song.name}`);
    console.log(`User ID: ${matchData.userId}`);
    console.log(`Bet: ${matchData.betValue}`);
    console.log(`Duration: ${gameLogic.demoSongDuration || -1} seconds`);
    console.log(`Redirect URL: ${Network.REDIRECT_URL}`);
    console.log(`demo: ${this.encrypt("demo=1&duration=30&betValue=2000&songId=0")}`);

    await this.fuckingWaitForFirstClick();

    if (getIsMobile()) this.enterFullscreen();

    Gameface.Instance.sceneManager.startScene(GameScene);
    GameScene.Instance.startSong(song);

    this.onSongStart();
  }

  public async beginLoad1() {

    console.log("process game params...");

    await this.processGameParams();

    console.log("Loading songs in SongManager...");

    const gameLogic = Gameface.Instance.gameLogic;
    const matchData = gameLogic.matchData;
    const songId = "song" + (parseInt(matchData.songId) + 1);

    await this.songManager.loadSong(songId);

    const song = this.songManager.getSong(songId);

    console.log(song.name)

    this.network.send<IPacketData_DataToStartGame>(
      PACKET_TYPE.PACKET_MATCH_DATA_TO_START_GAME,
      {
        matchData: this.gameLogic.matchData,
      }
    );

    const packet = await this.network.waitForPacket<IPacketData_StartGameData>(
      PACKET_TYPE.PACKET_MATCH_CONFIRM_START_GAME
    );

    console.log("confirmed", packet);

    Network.REDIRECT_URL = packet.redirectUrl;
  }

  private async processGameParams() {

    const q = location.href.split("/play/")[1];

    console.log(`q = ${q}`);

    let paramsText: string = "";
    
    try {
      paramsText = this.decrypt(q);
    } catch (error) {
      console.log(error);
      alert(`Coloque uma URL válida!`);
    }

    console.log(`params decrypted`);

    //matchId=22&betValue=20&songId=0&userId=1
    //bed9a8b55460f864acf684d8f5d83d388781799a81549d830ba348cab25748475674122c2abc04f1c658aa79e1443fbe

    //matchId=22&betValue=20&songId=1&userId=1
    //bed9a8b55460f864acf684d8f5d83d38a124c5aa5faa2e03a3831a893bc5b86b4eb7be00e1aa41a1c4918d6ebb94a85a
    
    const params = getQueryParamsFromString(paramsText);

    console.log(`got query params`);

    //console.log(params)

    let demo = params.demo;
    let duration = parseInt(params.duration);

    let matchId = params.matchId;
    let songId = params.songId;
    let userId = params.userId;
    let betValue = parseInt(params.betValue) / 100;

    const gameLogic = Gameface.Instance.gameLogic;
    const matchData = gameLogic.matchData;

    if(parseInt(demo) == 1)
    {
      matchId = "";
      userId = "demo";

      gameLogic.demoSongDuration = duration * 1000;
    }

    matchData.matchId = matchId;
    matchData.songId = songId;
    matchData.userId = userId;
    matchData.betValue = betValue;

    gameLogic.money = matchData.betValue;

    console.log(`params processed!`);
  }

  public onSongStart() {
    this.gameLogic.matchData.status = eMatchStatus.STARTED;
    this.sendMatchStatusChange("song started");
  }

  public onSongEnd() {
    this.gameLogic.matchData.status = eMatchStatus.FINISHED;
    this.sendMatchStatusChange("song ended");
    this.redirect(true);
  }

  public sendFinishGameWithCustomMoney(money: number)
  {
    this.network.send<IPacketData_ForceFinish>(
      PACKET_TYPE.PACKET_FORCE_FINISH,
      {
        money: money
      }
    );
    this.gameLogic.money = money;
    this.crashGame();
  }

  public onSongError(error: any) {
    this.gameLogic.matchData.status = eMatchStatus.ERROR;

    let message = "unknown"; // error under useUnknownInCatchVariables

    if (typeof error === "string") {
      message = error; // works, `e` narrowed to string
    } else if (error instanceof Error) {
      message = error.message; // works, `e` narrowed to Error
    }

    this.sendMatchStatusChange("song error: " + message);
    this.redirect(true);
  }

  public sendMatchStatusChange(message: string) {
    this.network.send<IPacketData_MatchStatusChange>(
      PACKET_TYPE.PACKET_MATCH_STATUS_CHANGE,
      {
        newStatus: this.gameLogic.matchData.status,
        message: message,
      }
    );
  }

  public redirect(toResults: boolean) {
    Gameface.setLoadingSpinnerVisible(true);

    // if(!toResults)
    // {
    //   location.href = Network.REDIRECT_URL + `/play`;
    //   return;
    // }

    const gameLogic = this.gameLogic;

    const pontos = gameLogic.score;
    const accuracy = (gameLogic.getAccuracy() * 100).toFixed(0);

    let earned = gameLogic.getMoneyEarned();
    earned = parseFloat(earned.toFixed(2));

    location.href = Network.REDIRECT_URL + `/result?pontos=${pontos}&accuracy=${accuracy}&totalEarned=${earned}`;
  }

  public crashGame() {
    GameScene.Instance.soundPlayer.crashGame();
  }

  private decrypt(encryptedData: string) {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);
    const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);

    const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedData);

    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedBytes,
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  }

  public encrypt(data: string) {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);
    const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Retorna o texto criptografado em formato hexadecimal
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  }


  private async waitForPreloadScene() {
    return new Promise<void>((resolve) => {
      const preloadScene =
        this.sceneManager.startScene<PreloadScene>(PreloadScene)!;
      preloadScene.onPreloadFinish = () => resolve();
    });
  }

  public isFullscreen() {
    const doc: any = document;

    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  public enterFullscreen() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();

      //const orientation: any = window.screen.orientation;
      //orientation.lock("landscape");
    }
  }

  public leaveFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  public toggleFullscreen() {
    if (this.isFullscreen()) {
      this.leaveFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  public updateScenesOrder() {
    if (GameScene.Instance) GameScene.Instance.scene.bringToTop();
    if (EditorScene.Instance) EditorScene.Instance.scene.bringToTop();
    if (MainScene.Instance) MainScene.Instance.scene.bringToTop();
    if (LoadScene.Instance) LoadScene.Instance.scene.bringToTop();
  }

  public async fuckingWaitForFirstClick() {
    const scene = MainScene.Instance;

    return new Promise<void>((resolve) => {
      scene.onStart = () => resolve();
    });
  }

  public update() {
    this.log("update");
  }

  public getGameSize() {
    const scale = this.phaser.scale;
    const gameSize = new Phaser.Math.Vector2(scale.width, scale.height);
    return gameSize;
  }

  public static setLoadingSpinnerVisible(visible: boolean)
  {
    if(visible)
    {
        $("#loading").show();
    } else {
        $("#loading").hide();
    }
  }
}
