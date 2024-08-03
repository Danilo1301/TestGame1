import { Debug } from "../../utils/debug/debug";
import Mesh from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { Notes } from "../notes/notes";
import { Pads } from "../notes/pads";

export class MainScene extends Phaser.Scene
{
    public static Instance: MainScene;
    
    constructor()
    {
        super({});

        MainScene.Instance = this;
    }

    public async create()
    {
        
    }

    public update(time: number, delta: number)
    {
        
    }
}