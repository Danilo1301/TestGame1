import { Debug } from "../../utils/debug/debug";
import Three from "../../utils/three/three";

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;
    
    constructor()
    {
        super({});

        GameScene.Instance = this;
    }

    public async create()
    {
        Debug.log("create scene");
    }

    public update(time: number, delta: number)
    {
    
    }
}