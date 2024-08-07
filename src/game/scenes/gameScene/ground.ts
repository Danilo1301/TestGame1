import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { ThreeScene } from "../../../utils/three/threeScene";
import THREE from "three";
import { GameScene } from "./gameScene";
import { setObjectPosition } from "../../../utils/utils";

export class Ground
{
    public plankSize: number = 10;

    public box1?: ExtendedObject3D;
    public box2?: ExtendedObject3D;

    constructor()
    {
        
    }

    public create()
    {
        this.box1 = this.createGroundPart(0, 0, 0);

        this.box2 = this.createGroundPart(0, 0, -this.plankSize);
        
        //setObjectPosition(this.box2, new THREE.Vector3(0, 0, -10));
    }

    private createGroundPart(x: number, y: number, z: number)
    {
        const threeScene = ThreeScene.Instance;

        const groundSize = new THREE.Vector3(3, 0.1, this.plankSize);

        //ground
        const texture = new THREE.TextureLoader().load('assets/guitar2.png');
        const material = new THREE.MeshStandardMaterial({ map: texture });

        // Cria o cubo com a geometria personalizada e o material
        const ground = threeScene.third.physics.add.box({
            mass: 0,
            width: groundSize.x,
            height: groundSize.y,
            depth: groundSize.z,
            x: x,
            y: y,
            z: z
        }, {custom: material});

        return ground;
    }

    public update()
    {
        const speed = GameScene.Instance.notes.getMovementSpeed();

        const box1 = this.box1!;
        this.movePositionBy(box1, speed);

        const box2 = this.box2!;
        this.movePositionBy(box2, speed);
    }

    public movePositionBy(object: ExtendedObject3D, z: number)
    {
        const bodyPosition = object.position;
        const position = new THREE.Vector3(bodyPosition.x, bodyPosition.y, bodyPosition.z);

        position.z += z;
        
        if(position.z >= this.plankSize)
        {
            position.z -= this.plankSize*2;
        }
       
        setObjectPosition(object, position);
    }
}