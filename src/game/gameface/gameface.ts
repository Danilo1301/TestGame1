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
import { getIsMobile } from "../constants/config";

export class Gameface extends BaseObject
{
    public static Instance: Gameface;
    public static isLowPerformance: boolean = true;
    public static isMobile: boolean = getIsMobile();

    public get phaser() { return this._phaser!; }
    public get sceneManager() { return this._sceneManager; }
    public get input() { return this._input; }

    private _phaser?: Phaser.Game;
    private _sceneManager: SceneManager;
    private _input: Input;
    
    constructor()
    {
        super();

        Gameface.Instance = this;

        this._sceneManager = new SceneManager(this);
        this._input = new Input();
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

        AssetLoad.addAssets();
        await AssetLoad.load();

        MainScene.Instance.createPlayButton();
        
        await this.fuckingWaitForFirstClick();

        if(getIsMobile()) this.enterFullscreen();

        const openEditor = false;

        if(openEditor)
        {
            this.sceneManager.startScene(EditorScene);
        } else {
            this.sceneManager.startScene(SongSelectionScene);
        }
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