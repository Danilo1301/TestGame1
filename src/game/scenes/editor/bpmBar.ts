import { Phaser3DObject } from "../../../utils/three/phaser3dObject";
import { ThreeScene } from "../../../utils/three/threeScene";
import { GameScene } from "../gameScene/gameScene";
import { MainScene } from "../mainScene";

export class BPMBar
{
    public object: Phaser3DObject;
    public image: Phaser.GameObjects.Image;
    public scale: number = 1.5;

    constructor(scene: Phaser.Scene)
    {
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
        this.object.setInvisible();

        this.image = scene.add.image(0, 0, "bpm_divisor");
        MainScene.Instance.layerGround.add(this.image);
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
        this.image.setScale(this.object.getScale() * this.scale);
    }

    public destroy()
    {
        this.image.destroy();
        this.object.destroy();
    }
}