import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { GameScene } from "../scenes/gameScene";

export class Note extends BaseObject
{
    public movementSpeed: number = 0;
    public meshObject: MeshObject;
    public image?: Phaser.GameObjects.Image;

    constructor(meshObject: MeshObject)
    {
        super();

        this.meshObject = meshObject;

        const scene = GameScene.Instance;

        this.image = scene.add.image(0, 0, "note");
    }

    public update()
    {
        const mesh = this.meshObject.mesh;
        mesh.position.z += this.movementSpeed;

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
}