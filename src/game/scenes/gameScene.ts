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

    constructor()
    {
        super({});

        this._notes = new Notes();
        this._pads = new Pads();

        GameScene.Instance = this;
    }

    public async create()
    {
        Debug.log("create scene");

        //

        const textureManager = this.textures;
        
        const gameSize = Gameface.Instance.getGameSize();

        const canvasKey = "test_canvas";
        const canvas = textureManager.createCanvas(canvasKey, gameSize.x, gameSize.y);
        this.canvas = canvas;

        const image = this.add.image(0, 0, canvasKey);
        image.setPosition(gameSize.x/2, gameSize.y/2);
        //image.setOrigin(0, 0);
        //image.setScale(0.5);

        //

        const mesh = Three.createBox(1, 0.01, 1);
        this.plank = Three.addMeshObject(mesh);

        const distance = 0.3;
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;

            this.pads.addPad(x, 0, 1.5);
        }

        setInterval(() => {
            GameScene.Instance.notes.spawnNoteForPad(2)
        }, 500);
    }

    public update(time: number, delta: number)
    {
        this.notes.update();

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