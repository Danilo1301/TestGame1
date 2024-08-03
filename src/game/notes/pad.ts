import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";

export class Pad extends BaseObject
{
    public get meshObject() { return this._meshObject; }

    private _meshObject: MeshObject;

    constructor(meshObject: MeshObject)
    {
        super();

        this._meshObject = meshObject;
    }

    public getPosition()
    {
        return this.meshObject.mesh.position;
    }
}