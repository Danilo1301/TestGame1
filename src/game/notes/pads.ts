import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Pad } from "./pad";

export class Pads extends BaseObject
{
    private _pads: Pad[] = [];
    
    public addPad(x: number, y: number, z: number)
    {
        const mesh = Three.createBox(0.1, 0.1, 0.1);
        const meshObject = Three.addMeshObject(mesh);
        meshObject.name = "Pad " + this._pads.length;
        mesh.position.set(x, y, z);

        const pad = new Pad(meshObject);
        this._pads.push(pad);
    }

    public getPad(index: number)
    {
        return this._pads[index];
    }
}