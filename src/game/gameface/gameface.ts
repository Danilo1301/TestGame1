import { AssetLoad } from "../../utils/assetLoad/assetLoad";
import { BaseObject } from "../../utils/baseObject";
import { Input } from "../../utils/input/input";
import { PhaserLoad } from "../../utils/phaserLoad/phaserLoad";
import Three from "../../utils/three/three";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";
import { SongSelectionScene } from "../scenes/songSelectionScene";
import { TestScene } from "../scenes/testScene";
import { SceneManager } from "./sceneManager";

export class Gameface extends BaseObject
{
    public static Instance: Gameface;

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

        this._phaser = await PhaserLoad.loadAsync();

        this.log(this.phaser);

        await Three.init();
        Three.animate();

        this.sceneManager.startScene(MainScene);

        this.input.init(MainScene.Instance);

        AssetLoad.addAssets();
        await AssetLoad.load();

        await this.fuckingWaitForFirstClick();

        MainScene.Instance.firstClickText?.destroy();
        MainScene.Instance.firstClickText = undefined;

        //this.sceneManager.startScene(GameScene);
        //this.sceneManager.startScene(TestScene);
        this.sceneManager.startScene(SongSelectionScene);

        
    }

    public updateScenesOrder()
    {
        if(GameScene.Instance) GameScene.Instance.scene.bringToTop();
        if(MainScene.Instance) MainScene.Instance.scene.bringToTop();
    }

    public async fuckingWaitForFirstClick()
    {
        const scene = MainScene.Instance;
        let started = false;

        return new Promise<void>((resolve) => {
            scene.input.on('pointerup', () => {
                if(!started)
                {
                    started = true;
                    resolve();
                }
            });
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