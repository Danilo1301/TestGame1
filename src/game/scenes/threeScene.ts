import Phaser from 'phaser';
import { ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension'
import * as THREE from 'three';
import { Gameface } from '../gameface/gameface';

export class ThreeScene extends Scene3D
{
    public static Instance: ThreeScene;

    public box!: ExtendedObject3D;
    public text!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'Test2Scene' });

        ThreeScene.Instance = this;
    }

    public init()
    {
        this.accessThirdDimension()
    }

    public create()
    {
        this.third.warpSpeed()

        const box = this.third.physics.add.box({x: 0, y: 10});
        this.box = box;

        const text = this.add.text(0, 0, 'Cubo', {
            fontSize: '16px',
            color: '#000000'
        });
        this.text = text;
    }

    public update()
    {
        const box = this.box;

        const screenPosition = ThreeScene.projectToScreen(box.position);

        console.log(screenPosition);

        const text = this.text;
        text.setPosition(screenPosition.x, screenPosition.y);

    }

    public static projectToScreen(position: THREE.Vector3): { x: number; y: number } {
        const scene = ThreeScene.Instance;

        const size = Gameface.Instance.getGameSize();

        const vector = position.clone().project(scene.third.camera);
        const widthHalf = size.x / 2;
        const heightHalf = size.y / 2;
        
        return {
            x: (vector.x * widthHalf) + widthHalf,
            y: -(vector.y * heightHalf) + heightHalf
        };
    }
}