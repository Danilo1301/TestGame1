import * as THREE from 'three';
import { DebugText } from '../debug/debugText';
import { ExtendedObject3D } from '@enable3d/phaser-extension';
import { ThreeScene } from './threeScene';

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
        //this.debugText.setLine("scale", `Scale:  ${this.getScale().toFixed(2)}`);
        this.debugText.set3DPosition(this.object.position);
        this.debugText.update();


    }

    public destroy()
    {
        this.debugText.destroy();
        
        ThreeScene.Instance.third.scene.remove(this.object);
    }

    public getScale()
    {
        const left = this.object.position.clone();
        left.x -= 0.5;

        const right = this.object.position.clone();
        right.x += 0.5;

        const s1 = ThreeScene.projectToScreen(left);
        const s2 = ThreeScene.projectToScreen(right);

        return (s2.x - s1.x) * 0.01;
    }

    public setInvisible()
    {
        const mat = this.object.material as THREE.Material;
        this.object.castShadow = false;
        mat.transparent = true;
        mat.opacity = 0.0;
    }
}