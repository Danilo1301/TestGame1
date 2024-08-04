import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Pad } from "./pad";

export class Pads extends BaseObject
{
    public get pads() { return this._pads; };
    public get numOfPads() { return this._pads.length; };

    private _pads: Pad[] = [];
    
    public addPad(x: number, y: number, z: number)
    {
        const mesh = Three.createBox(0.1, 0.1, 0.1);
        const meshObject = Three.addMeshObject(mesh);
        meshObject.name = "Pad " + this._pads.length;
        mesh.position.set(x, y, z);

        const pad = new Pad(meshObject);
        this._pads.push(pad);

        return pad;
    }

    public getPad(index: number)
    {
        const pad = this._pads[index];

        if(pad == undefined)
        {
            console.error("Could not find pad " + index);
        }

        return pad;
    }

    public update()
    {
        for(const pad of this._pads)
        {
            pad.update();
        }
    }
}