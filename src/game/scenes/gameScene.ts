import { Debug } from "../../utils/debug/debug";
import Mesh from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Song } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { Notes } from "../notes/notes";
import { Pads } from "../pads/pads";
import { MainScene } from "./mainScene";

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
        this.add.image(50, 50, "pad");

        return;

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

        Three.animate();

        if(Gameface.isLowPerformance)
        {
            setInterval(() => {
                Three.animate();
            }, 500);
        }

        //GameScene.Instance.notes.spawnRandomNoteForPad();
    }

    public startSong(song: Song)
    {
        setTimeout(() => {
            setTimeout(() => {
                this.sound.play(song.sound, {volume: 0.1});
            }, 1000);
    
            this.notes.soundNotes.startSong(song);
        }, 1000);
    }

    public update(time: number, delta: number)
    {
        return;

        this.notes.update(delta);
        this.pads.update();

    
        const plank = this.plank!;
        //plank.mesh.position.z += this.notes.getMovementSpeed();
        if(plank.mesh.position.z >= 3)
        {
            plank.mesh.position.z = 0;
        }

        this.updateThreeCanvas();
    }

    private createThreeCanvas()
    {
        const dom = this.add.dom(0, 0, Three.renderer.domElement);
        dom.setOrigin(0);
        MainScene.Instance.layerNormal.add(dom);

        this.add.image(0, 0, "note");

        /*
        return;

        const textureManager = this.textures;
        
        const gameSize = Gameface.Instance.getGameSize();

        const canvasKey = "test_canvas";
        const canvas = textureManager.createCanvas(canvasKey, gameSize.x, gameSize.y);
        this.canvas = canvas;

        const image = this.add.image(0, 0, canvasKey);
        image.setPosition(gameSize.x/2, gameSize.y/2);
        //image.setOrigin(0, 0);
        //image.setScale(0.5);
        */
    }

    private updateThreeCanvas()
    {

        Three.renderer.domElement.style.position = "fixed";
        Three.renderer.domElement.style.top = "0";

        //gameface.phaser.renderer.canvas.style

        Three.update();

        //Three.animate();

       
       /*
        const gameSize = Gameface.Instance.getGameSize();

        const canvas = this.canvas!;

        canvas.clear();
        canvas.context.fillStyle = "green";
        //canvas.context.fillRect(0, 0, gameSize.x, gameSize.y);
        
        //lags the fuck out
        //canvas.context.drawImage(Three.renderer.domElement, 0, 0, gameSize.x, gameSize.y);

        canvas.refresh();
        */
        
    }
}