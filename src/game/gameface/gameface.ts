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
import { getIsMobile, getQueryParams, getQueryParamsFromString } from "../../utils/utils";
import CryptoJS from 'crypto-js' 
import { Network } from "../network/network";
import { IPacketData_DataToStartGame, IPacketData_Event, IPacketData_MatchStatusChange, PACKET_TYPE } from "../network/packet";
import { eGameEventType } from "../network/eGameEventType";
import { eMatchStatus, MatchData } from "./matchData";
import { ENCRYPTION_SECRET_KEY } from "../../server/keys";
import { GameLogic } from "./gameLogic";
import { SongManager } from "../songManager";
import { LoadScene } from "../scenes/loadScene";

export class Gameface extends BaseObject
{
    public static Instance: Gameface;
    public static isLowPerformance: boolean = true;
    public static isMobile: boolean = getIsMobile();

    public get phaser() { return this._phaser!; }
    public get sceneManager() { return this._sceneManager; }
    public get input() { return this._input; }
    public get network() { return this._network; }
    public get gameLogic() { return this._gameLogic; }
    public get songManager() { return this._songManager; }

    private _phaser?: Phaser.Game;
    private _sceneManager: SceneManager;
    private _input: Input;
    private _network: Network;
    private _gameLogic: GameLogic;
    private _songManager: SongManager;

    constructor()
    {
        super();

        Gameface.Instance = this;

        this._sceneManager = new SceneManager(this);
        this._input = new Input();
        this._network = new Network();
        this._gameLogic = new GameLogic();
        this._songManager = new SongManager();

        this._gameLogic.createPads();
    }

    public async start()
    {
        this.log("start");

        if(Gameface.isMobile) this.log("Is mobile");

        this._phaser = await PhaserLoad.loadAsync();

        this.log(this.phaser);

        await this.waitForPreloadScene();

        this.sceneManager.startScene(MainScene);
        this.sceneManager.startScene(ThreeScene);

        this.input.init(MainScene.Instance);

        /*
        try {
            await this.processGameParams();

            this.log("Loading songs...");

            await this.songManager.loadSong("song1");
        } catch (error) {
            console.error(error);

            this.onSongError(error);
        }
        
            */


        
        AssetLoad.addAssets();
        await AssetLoad.load();

        MainScene.Instance.createPlayButton();
        
        console.log(`\n\n\n\n%cGuitar Game\x1b[0m\nVocê encontrará algumas opções em window.game\n\n\n\n`, 'background: #222; color: #bada55; font-size: 24px;');

        await this.fuckingWaitForFirstClick();

        if(getIsMobile()) this.enterFullscreen();

        const gameLogic = this.gameLogic;
        const matchData = gameLogic.matchData;
        const songId = this.gameLogic.matchData.songId;

        const song = this.songManager.getSong("song1");

        Gameface.Instance.sceneManager.startScene(GameScene);
        GameScene.Instance.startSong(song);

        this.onSongStart();
        

        /*
        const openEditor = false;

        if(openEditor)
        {
            this.sceneManager.startScene(EditorScene);
        } else {
            this.sceneManager.startScene(SongSelectionScene);
        }
        */
    }

    public async beginLoad1()
    {
        await this.processGameParams();

        this.log("Loading songs...");

        await this.songManager.loadSong("song1");

        const song = this.songManager.getSong("song1");

        console.log(song.name)

        this.network.send<IPacketData_DataToStartGame>(PACKET_TYPE.PACKET_MATCH_DATA_TO_START_GAME, {
            matchData: this.gameLogic.matchData
        })

        await this.network.waitForPacket(PACKET_TYPE.PACKET_MATCH_CONFIRM_START_GAME);

        console.log("confirmed")
    }

    private async processGameParams()
    {
        const q = location.href.split("/play/")[1];
        const paramsText = this.decrypt(q);

        const params = getQueryParamsFromString(paramsText);

        //console.log(params)

        const matchId = params.matchId;
        const songId = params.songId;
        const userId = params.userId;
        const betValue = parseInt(params.betValue);

        const gameLogic = Gameface.Instance.gameLogic;
        const matchData = gameLogic.matchData;
        
        matchData.matchId = matchId;
        matchData.songId = songId;
        matchData.userId = userId;
        matchData.betValue = betValue;

        gameLogic.money = matchData.betValue;
    }
    

    public onSongStart()
    {
        this.gameLogic.matchData.status = eMatchStatus.STARTED;
        this.sendMatchStatusChange("song started");
    }

    public onSongEnd()
    {
        this.gameLogic.matchData.status = eMatchStatus.FINISHED;
        this.sendMatchStatusChange("song ended");
    }

    public onSongError(error: any)
    {
        this.gameLogic.matchData.status = eMatchStatus.ERROR;

        let message = "unknown"; // error under useUnknownInCatchVariables 

        if (typeof error === "string") {
            message = error // works, `e` narrowed to string
        } else if (error instanceof Error) {
            message = error.message // works, `e` narrowed to Error
        }

        this.sendMatchStatusChange("song error: " + message);
        this.redirect();
    }

    public sendMatchStatusChange(message: string)
    {
        this.network.send<IPacketData_MatchStatusChange>(PACKET_TYPE.PACKET_MATCH_STATUS_CHANGE, {
            newStatus: this.gameLogic.matchData.status,
            message: message
        })
    }

    public redirect()
    {
        const url = "https://guitarrinha.com/play"
        location.href = url;
    }

    public crashGame()
    {
        GameScene.Instance.soundPlayer.crashGame()
    }

    private decrypt(encryptedData: string) {

        const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_SECRET_KEY);
        const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_SECRET_KEY);

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

    private async waitForPreloadScene()
    {
        return new Promise<void>((resolve) => {
            const preloadScene = this.sceneManager.startScene<PreloadScene>(PreloadScene)!;
            preloadScene.onPreloadFinish = () => resolve();
        });
    }

    public isFullscreen()
    {
        const doc: any = document;

        return doc.fullscreenElement || 
            doc.webkitFullscreenElement || 
            doc.mozFullScreenElement || 
            doc.msFullscreenElement;
    }

    public enterFullscreen()
    {
        var elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();

            //const orientation: any = window.screen.orientation;
            //orientation.lock("landscape");
        }
    }

    public leaveFullscreen()
    {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    public toggleFullscreen()
    {
        if(this.isFullscreen())
        {
            this.leaveFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    public updateScenesOrder()
    {
        if(GameScene.Instance) GameScene.Instance.scene.bringToTop();
        if(EditorScene.Instance) EditorScene.Instance.scene.bringToTop();
        if(MainScene.Instance) MainScene.Instance.scene.bringToTop();
        if(LoadScene.Instance) LoadScene.Instance.scene.bringToTop();
    }

    public async fuckingWaitForFirstClick()
    {
        const scene = MainScene.Instance;

        return new Promise<void>((resolve) => {
            scene.onStart = () => resolve();
        });
    }

    public update()
    {
        this.log("update");
    }

    public getGameSize()
    {
        const scale = this.phaser.scale;
        const gameSize = new Phaser.Math.Vector2(scale.width, scale.height);
        return gameSize;
    }
}