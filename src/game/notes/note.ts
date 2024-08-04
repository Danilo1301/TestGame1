import { BaseObject } from "../../utils/baseObject";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { Pad } from "../pads/pad";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";

export class Note extends BaseObject
{
    public movementSpeed: number = 0;
    public image?: Phaser.GameObjects.Image;
    public canMove: boolean = true;
    public padIndex: number = -1;
    public object: Phaser3DObject;

    constructor(object: Phaser3DObject)
    {
        super();

        this.object = object;

        const scene = GameScene.Instance;

        this.image = scene.add.image(0, 0, "note");
        MainScene.Instance.layerHud.add(this.image);
    }

    public update()
    {
        const object = this.object.object;

        if(this.canMove)
        {
            object.position.z += this.movementSpeed;
        }

        if(this.image)
        {
            const screenPosition = ThreeScene.projectToScreen(object.position);

            this.image.setPosition(screenPosition.x, screenPosition.y);

            const scale = ThreeScene.getDistanceFromCamera(object.position) * 0.1;

            this.object.debugText.setLine("scale", `x${scale.toFixed(2)}`);

            //this.image.setScale(scale);
        }
    }

    public destroy()
    {
        this.object.destroy();
        this.image?.destroy();
        this.image = undefined;
    }

    public getDistanceFromPad(pad: Pad)
    {
        const padPosition = pad.object.object.position;
        const position = this.object.object.position;

        const distance = padPosition.distanceTo(position);
        return distance;
    }
}