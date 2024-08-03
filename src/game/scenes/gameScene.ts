import { Debug } from "../../utils/debug/debug";
import Mesh from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { Notes } from "../notes/notes";
import { Pads } from "../notes/pads";

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;
    
    public get notes() { return this._notes; }
    public get pads() { return this._pads; }

    private _notes: Notes;
    private _pads: Pads;

    public canvas?: Phaser.Textures.CanvasTexture;
    public plank?: Mesh;

    public padKeys: string[] = ["A", "S", "D", "F", "G"];

    constructor()
    {
        super({});

        this._notes = new Notes();
        this._pads = new Pads();

        GameScene.Instance = this;
    }

    public async create()
    {
        this.createThreeCanvas();

        //

        const mesh = Three.createBox(1.75, 0.01, 4);
        this.plank = Three.addMeshObject(mesh);

        const distance = 0.3;
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;

            const pad = this.pads.addPad(x, 0, 1.5);
            pad.setKey(this.padKeys[i]);
        }

        setTimeout(() => {
            this.sound.play("sound1", {volume: 0.1});
        }, 1000);

        this.notes.soundNotes.startSong();

        //GameScene.Instance.notes.spawnRandomNoteForPad();
    }

    public update(time: number, delta: number)
    {
        this.notes.update(delta);
        this.pads.update();

        const plank = this.plank!;
        plank.mesh.position.z += this.notes.getMovementSpeed();
        if(plank.mesh.position.z >= 3)
        {
            plank.mesh.position.z = 0;
        }

        this.updateThreeCanvas();
    }

    private createThreeCanvas()
    {
        const textureManager = this.textures;
        
        const gameSize = Gameface.Instance.getGameSize();

        const canvasKey = "test_canvas";
        const canvas = textureManager.createCanvas(canvasKey, gameSize.x, gameSize.y);
        this.canvas = canvas;

        const image = this.add.image(0, 0, canvasKey);
        image.setPosition(gameSize.x/2, gameSize.y/2);
        //image.setOrigin(0, 0);
        //image.setScale(0.5);
    }

    private updateThreeCanvas()
    {
        Three.animate();

        const gameSize = Gameface.Instance.getGameSize();

        const canvas = this.canvas!;

        canvas.clear();
        //canvas.context.fillStyle = "green";
        //canvas.context.fillRect(0, 0, Three.size.x, Three.size.y);
        canvas.context.drawImage(Three.renderer.domElement, 0, 0, gameSize.x, gameSize.y);
        canvas.refresh();
    }
}