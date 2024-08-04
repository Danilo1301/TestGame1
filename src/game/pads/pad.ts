import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { GameScene } from "../scenes/gameScene";

export class Pad extends BaseObject
{
    public image?: Phaser.GameObjects.Image;
    public meshObject: MeshObject;

    private _keyObject?: Phaser.Input.Keyboard.Key;

    constructor(meshObject: MeshObject)
    {
        super();

        this.meshObject = meshObject;

        const scene = GameScene.Instance;
        
        this.image = scene.add.image(0, 0, "pad");
    }

    public getPosition()
    {
        return this.meshObject.mesh.position;
    }

    public getIndex()
    {
        const index = GameScene.Instance.pads.pads.indexOf(this);
        return index;
    }

    public setKey(key: string)
    {
        const keyBoard = Gameface.Instance.input.sceneInput.keyboard;

        if(!keyBoard) throw "Keyboard is null";

        const keyObject = keyBoard.addKey(key);

        const pad = this;

        keyObject.on('down', function(event: KeyboardEvent) 
        {
            console.log("pad down")

            const note = GameScene.Instance.notes.getClosestNoteForPad(pad.getIndex());

            if(note)
            {
                const notes = GameScene.Instance.notes;

                const distance = note.getDistanceFromPad(pad);
                const isGood = notes.isDistanceBetweenMsInterval(distance, 100);
                
                if(isGood)
                {
                    note.canMove = false;
                }
            }
        });
        
        this._keyObject = keyObject;
    }

    public update()
    {
        const keyObject = this._keyObject!;

        if(this.image)
        {
            const screenPosition = Three.convert3DPositionTo2D(this.meshObject.mesh.position);

            this.image.setPosition(screenPosition.x, screenPosition.y);

            this.image.tint = keyObject.isDown ? 0xffffff : 0x0;
        }
    }
}