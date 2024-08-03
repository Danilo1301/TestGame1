import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { GameScene } from "../scenes/gameScene";

export class Note extends BaseObject
{
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
        mesh.position.z += 0.03;

        if(this.image)
        {
            const screenPosition = Three.convert3DPositionTo2D(this.meshObject.mesh.position);

            this.image.setPosition(screenPosition.x, screenPosition.y);
        }
    }

    public destroy()
    {
        this.meshObject.destroy();
        this.image?.destroy();
        this.image = undefined;
    }
}