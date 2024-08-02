import { BaseObject } from "../../utils/baseObject";
import { PhaserLoad } from "../../utils/phaserLoad/phaserLoad";
import Three from "../../utils/three/three";
import { GameScene } from "../scenes/gameScene";
import { Test1Scene } from "../scenes/test1Scene";
import { SceneManager } from "./sceneManager";

export class Gameface extends BaseObject
{
    public static Instance: Gameface;

    public get phaser() { return this._phaser!; }
    public get sceneManager() { return this._sceneManager; }

    private _phaser?: Phaser.Game;
    private _sceneManager: SceneManager;
    
    constructor()
    {
        super();

        Gameface.Instance = this;

        this._sceneManager = new SceneManager(this);
    }

    public async start()
    {
        this.log("start");

        this._phaser = await PhaserLoad.loadAsync();

        this.log(this.phaser);

        await Three.init();

        this.sceneManager.startScene(GameScene);
        this.sceneManager.startScene(Test1Scene);
    }
}