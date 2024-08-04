import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { Pad } from "../pads/pad";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";

export class Note extends BaseObject
{
    public movementSpeed: number = 0;
    public meshObject: MeshObject;
    public image?: Phaser.GameObjects.Image;
    public canMove: boolean = true;
    public padIndex: number = -1;

    constructor(meshObject: MeshObject)
    {
        super();

        this.meshObject = meshObject;

        const scene = GameScene.Instance;

        this.image = scene.add.image(0, 0, "note");
        MainScene.Instance.layerHud.add(this.image);
    }

    public update()
    {
        const mesh = this.meshObject.mesh;

        if(this.canMove)
        {
            mesh.position.z += this.movementSpeed;
        }

        if(this.image)
        {
            const screenPosition = Three.convert3DPositionTo2D(this.meshObject.mesh.position);

            this.image.setPosition(screenPosition.x, screenPosition.y);

            const scale = Three.getDistanceFromCamera(mesh.position) * 0.1;

            this.meshObject.debugText.setLine("scale", `x${scale.toFixed(2)}`);

            //this.image.setScale(scale);
        }
    }

    public destroy()
    {
        this.meshObject.destroy();
        this.image?.destroy();
        this.image = undefined;
    }

    public getDistanceFromPad(pad: Pad)
    {
        const padPosition = pad.meshObject.mesh.position;
        const position = this.meshObject.mesh.position;

        const distance = padPosition.distanceTo(position);
        return distance;
    }
}