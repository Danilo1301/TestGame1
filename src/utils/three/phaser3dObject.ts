import * as THREE from 'three';
import { DebugText } from '../debug/debugText';
import { ExtendedObject3D } from '@enable3d/phaser-extension';

export class Phaser3DObject
{
    public object: ExtendedObject3D;
    public debugText: DebugText;
    public name: string = "Object";

    constructor(threeObject: ExtendedObject3D)
    {
        this.object = threeObject;
        this.debugText = new DebugText("Object");
    }

    public update()
    {
        this.debugText.setLine("title", this.name);
        this.debugText.set3DPosition(this.object.position);
        this.debugText.update();
    }

    public destroy()
    {
        this.debugText.destroy();
    }
}