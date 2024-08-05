import Phaser from 'phaser';
import { ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension'
import * as THREE from 'three';
import { Gameface } from '../../game/gameface/gameface';
import { Phaser3DObject } from './phaser3dObject';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class ThreeScene extends Scene3D
{
    public static Instance: ThreeScene;
    public static phaser3dObjects: Phaser3DObject[] = [];

    public box!: ExtendedObject3D;
    public controls!: OrbitControls;

    constructor() {
        super({ key: 'ThreeScene' });

        ThreeScene.Instance = this;
    }

    public init()
    {
        this.accessThirdDimension();
    }

    public create()
    {
        this.third.warpSpeed("-ground");

        this.third.camera.position.set(0, 4, 7);
        this.third.camera.lookAt(0, 0, 2.5);

        /*
        const box = this.third.physics.add.box({x: 0, y: 5});
        ThreeScene.addPhaser3DObject(box);
        this.box = box;

        this.third.add.box({x: 0, y: 2});
        */
    }

    public update()
    {
        for(const object of ThreeScene.phaser3dObjects) object.update();
    }

    public static projectToScreen(position: THREE.Vector3)
    {
        const scene = ThreeScene.Instance;

        const size = Gameface.Instance.getGameSize();

        const vector = position.clone().project(scene.third.camera);
        const widthHalf = size.x / 2;
        const heightHalf = size.y / 2;
        
        const screenPosition = new THREE.Vector2(
            (vector.x * widthHalf) + widthHalf,
            -(vector.y * heightHalf) + heightHalf
        );

        return screenPosition;
    }

    public static getDistanceFromCamera(position: THREE.Vector3)
    {
        const scene = ThreeScene.Instance;

        const cameraPosition = scene.third.camera.position;
        return position.distanceTo(cameraPosition);
    }

    public static addPhaser3DObject(threeObject: ExtendedObject3D)
    {
        const object = new Phaser3DObject(threeObject);
        this.phaser3dObjects.push(object);
        return object;
    }
}