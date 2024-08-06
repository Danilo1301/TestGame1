import { Phaser3DObject } from "../../../utils/three/phaser3dObject";
import { ThreeScene } from "../../../utils/three/threeScene";
import { GameScene } from "../gameScene/gameScene";

export class BPMBar
{
    public object: Phaser3DObject;
    public image: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene)
    {
        scene.add.rectangle(0, 0, 200, 5, 0xffffff);

        const threeScene = ThreeScene.Instance;

        const obj = threeScene.third.add.box({
            width: 0.2,
            height: 0.2,
            depth: 0.2,
            x: 0,
            y: 0,
            z: 0
        }, {});

        this.object = ThreeScene.addPhaser3DObject(obj);

        this.image = scene.add.image(0, 0, "bpm_divisor");
    }

    public setTimeMs(ms: number)
    {
        const distance = GameScene.Instance.notes.getDistanceFromMs(ms);
        //const z = distance;

        let z = GameScene.Instance.ground.plankSize/2;
        z += distance;

        let y = GameScene.Instance.pads.padHeight;

        this.object.object.position.set(0, y, z);
    }

    public update()
    {
        const screenPos = ThreeScene.projectToScreen(this.object.object.position);

        this.image.setPosition(screenPos.x, screenPos.y);
        this.image.setScale(this.object.getScale());
    }
}