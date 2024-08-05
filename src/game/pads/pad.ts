import { BaseObject } from "../../utils/baseObject";
import { Input } from "../../utils/input/input";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";

export class Pad extends BaseObject
{
    public image?: Phaser.GameObjects.Image;
    public object: Phaser3DObject;
    public position: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    private _active: boolean = false;

    private _keyObject?: Phaser.Input.Keyboard.Key;

    constructor(object: Phaser3DObject)
    {
        super();

        this.object = object;

        const scene = GameScene.Instance;
        
        this.image = scene.add.image(0, 0, "pad");

        Input.events.on("pointerdown", (event: PointerEvent) => {
            console.log("poniter down")

            const mousePosition = Input.mousePosition;
            const position = this.position;
            const distance = position.distance(mousePosition);

            console.log(mousePosition, distance)

            if(distance < 30)
            {
                this.activatePad();
            }
        });

        Input.events.on("pointerup", (event: PointerEvent) => {
            this._active = false;
        });
    }

    public activatePad()
    {
        this._active = true;

        const note = GameScene.Instance.notes.getClosestNoteForPad(this.getIndex());

        if(note)
        {
            const notes = GameScene.Instance.notes;

            const distance = note.getDistanceFromPad(this);
            const isGood = notes.isDistanceBetweenMsInterval(distance, 100);
            
            if(isGood)
            {
                note.canMove = false;
                note.image!.alpha = 0.1;
            }
        }
    }

    public getPosition()
    {
        return this.object.object.position;
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
            pad.activatePad();
        });

        keyObject.on('up', function(event: KeyboardEvent) 
        {
            pad._active = false;
        });
        
        this._keyObject = keyObject;
    }

    public update()
    {
        const active = this._active;

        const screenPosition = ThreeScene.projectToScreen(this.object.object.position);
        this.position.set(screenPosition.x, screenPosition.y);

        if(this.image)
        {
            this.image.setPosition(this.position.x, this.position.y);

            this.image.tint = active ? 0xffffff : 0x0;
        }
    }
}