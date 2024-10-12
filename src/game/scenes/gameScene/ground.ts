import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { ThreeScene } from "../../../utils/three/threeScene";
import THREE from "three";
import { GameScene } from "./gameScene";
import { setObjectPosition } from "../../../utils/utils";

export class Ground
{
    public plankSize: number = 11;

    public boxes: ExtendedObject3D[] = [];

    constructor()
    {
        
    }

    public create()
    {
        this.boxes.push(this.createGroundPart(0, 0, 0));
        this.boxes.push(this.createGroundPart(0, 0, 0));
        this.boxes.push(this.createGroundPart(0, 0, 0));
        this.boxes.push(this.createGroundPart(0, 0, 0));
        //this.boxes.push(this.createGroundPart(0, 0, 0));

        //this.box2 = this.createGroundPart(0, 0, -this.plankSize);
        
        //setObjectPosition(this.box2, new THREE.Vector3(0, 0, -10));
    }

    private createGroundPart(x: number, y: number, z: number)
    {
        const threeScene = ThreeScene.Instance;

        const groundSize = new THREE.Vector3(3, 0.1, this.plankSize);

        //ground
        const texture = new THREE.TextureLoader().load('/assets/guitar2.png');
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
        const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        const distance = GameScene.Instance.notes.getDistanceFromMs(time);

        for(var i = 0; i < this.boxes.length; i++)
        {
            const box = this.boxes[i];
            //const index = i;

            let z = (distance % this.plankSize) - (i * this.plankSize);

            //make it far
            z += this.plankSize;

            const position = box.position.clone();
            position.x = 0;
            position.y = 0;
            position.z = z;

            setObjectPosition(box, position);
        }
    }
}