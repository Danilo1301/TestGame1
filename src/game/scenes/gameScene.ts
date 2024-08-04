import * as THREE from 'three';
import { ThreeScene } from "../../utils/three/threeScene";
import { Song } from "../constants/songs";
import { Notes } from "../notes/notes";
import { Pads } from "../pads/pads";
import { ExtendedObject3D } from '@enable3d/phaser-extension';
import { setObjectPosition } from '../../utils/utils';

export class Ground {
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
        const texture = new THREE.TextureLoader().load('crate.gif');
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

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;

    public ground: Ground;

    public get notes() { return this._notes; }
    public get pads() { return this._pads; }

    private _notes: Notes;
    private _pads: Pads;

    public canvas?: Phaser.Textures.CanvasTexture;

    public padKeys: string[] = ["A", "S", "D", "F", "G"];

    constructor()
    {
        super({});

        this.ground = new Ground();
        this._notes = new Notes();
        this._pads = new Pads();

        GameScene.Instance = this;
    }

    public async create()
    {
        this.ground.create();

        /*
        const ground = threeScene.third.physics.add.box({x: 0, y: -0.2, mass: 0, width: 3, depth: this.plankSize, height: 0.1});
        const groundObject = ThreeScene.addPhaser3DObject(ground);
        groundObject.name = "Ground";
        */


        //add pads
        const distance = 0.5;
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;
            const z = this.ground.plankSize / 2;

            const pad = this.pads.addPad(x, 0, z);
            pad.setKey(this.padKeys[i]);
        }

        //test
        //this.notes.spawnRandomNoteForPad();
    }

    public startSong(song: Song)
    {
        
        setTimeout(() => {
            setTimeout(() => {
                this.sound.play(song.sound, {volume: 0.1});
            }, 3000);
    
            this.notes.soundNotes.startSong(song);
        }, 1000);
        
    }

    public update(time: number, delta: number)
    {
        this.ground.update();
        this.notes.update(delta);
        this.pads.update();
    }
}