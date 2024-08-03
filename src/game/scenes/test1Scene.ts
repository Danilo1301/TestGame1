import { Debug } from "../../utils/debug/debug";
import Three from "../../utils/three/three";

//test
import * as THREE from 'three';
import { Gameface } from "../gameface/gameface";

export class Test1Scene extends Phaser.Scene
{
    constructor()
    {
        super({});
    }

    public async create()
    {
        Debug.log("create scene");

        
    }

    public update(time: number, delta: number)
    {
        
    }
}