import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import { Gameface } from "../gameface/gameface";

export class Pad extends BaseObject
{
    public get meshObject() { return this._meshObject; }

    private _meshObject: MeshObject;
    private _keyObject?: Phaser.Input.Keyboard.Key;

    constructor(meshObject: MeshObject)
    {
        super();

        this._meshObject = meshObject;
    }

    public getPosition()
    {
        return this.meshObject.mesh.position;
    }

    public setKey(key: string)
    {
        const keyObject = Gameface.Instance.input.sceneInput.keyboard.addKey(key);

        keyObject.on('down', function(event: KeyboardEvent) 
        {
            console.log("pad down")
        });
        
        this._keyObject = keyObject;
    }

    public update()
    {
        const keyObject = this._keyObject!;

        
    }
}