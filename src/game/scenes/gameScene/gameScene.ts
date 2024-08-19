import { Song, SongNote } from "../../constants/songs";
import { Notes } from "../../notes/notes";
import { Pads } from "../../pads/pads";
import { Button } from '../../../utils/ui/button';
import { Gameface } from '../../gameface/gameface';
import { SoundPlayer } from './soundPlayer';
import { Ground } from './ground';
import { ThreeScene } from "../../../utils/three/threeScene";
import { MainScene } from "../mainScene";
import { Hud } from "../../hud/hud";
import { HitAccuracy } from "./hitAccuracy";
import { eNoteHitGood, Note } from "../../notes/note";
import { GameProgressBar } from "./gameProgressBar";
import { GuitarHud } from "./guitarHud";

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;

    public ground: Ground;

    public topRightContainer!: Phaser.GameObjects.Container;

    public combo: number = 0;
    public prevHitSongNote?: SongNote;

    public get soundPlayer() { return this._soundPlayer; }
    public get notes() { return this._notes; }
    public get pads() { return this._pads; }
    public get hitAccuracy() { return this._hitAccuracy; }
    public get gameProgressBar() { return this._gameProgressBar; }

    private _soundPlayer: SoundPlayer;
    private _notes: Notes;
    private _pads: Pads;
    private _hitAccuracy: HitAccuracy;
    private _gameProgressBar: GameProgressBar;
    private _guitarHud: GuitarHud;

    //public canvas?: Phaser.Textures.CanvasTexture;

    public padKeys: string[] = ["A", "S", "D", "F", "G"];
    public padColors: number[] = [0x00ff00, 0xff0000, 0xffff00, 0x0094FF, 0xFF8A3D];

    constructor()
    {
        super({});

        this.ground = new Ground();

        this._soundPlayer = new SoundPlayer();
        this._notes = new Notes();
        this._pads = new Pads();
        this._hitAccuracy = new HitAccuracy();
        this._gameProgressBar = new GameProgressBar();
        this._guitarHud = new GuitarHud();

        GameScene.Instance = this;
    }

    public setupAnims()
    {
        this.anims.create({
            key: "pad_color_idle",
            frameRate: 4,
            frames: this.anims.generateFrameNames("pad_sheet", {
                prefix: "pad_color",
                suffix: ".png",
                start: 1,
                end: 1
            }),
            repeat: -1
        });

        this.anims.create({
            key: "pad_color_raise",
            frameRate: 25,
            frames: this.anims.generateFrameNames("pad_sheet", {
                prefix: "pad_color",
                suffix: ".png",
                start: 2,
                end: 3
            }),
            repeat: 0
        });
        
        this.anims.create({
            key: "note_color_idle",
            frameRate: 12,
            frames: this.anims.generateFrameNames("note_sheet", {
                prefix: "note_color",
                suffix: ".png",
                start: 1,
                end: 4
            }),
            repeat: -1
        });
    }

    public async create()
    {
        this.setupAnims();

        this.ground.create();
        this.hitAccuracy.create(this);
        this.gameProgressBar.create(this);

        this.createBackground();

        this.createPads();

        var sprite = this.add.sprite(50, 50, "note_sheet", "note_color1.png");

        //top right container
        const gameSize = Gameface.Instance.getGameSize();

        this.topRightContainer = this.add.container();
        this.topRightContainer.setPosition(gameSize.x, 0);
        Hud.addToHudLayer(this.topRightContainer);

        this._guitarHud.create();
    }

    private createBackground()
    {
        //background
        const createBackground = false;
        if(createBackground)
        {
            const gameSize = Gameface.Instance.getGameSize();

            const x = 1280/900;
            const y = 720/600;

            const background = this.add.image(0, 0, "background");
            background.setOrigin(0.5);
            background.setPosition(gameSize.x/2, gameSize.y/2);
            background.setScale(x, y);

            const shape = this.add.image(0, 0, "mask").setVisible(false);
            shape.setOrigin(0.5);
            shape.setPosition(gameSize.x/2, gameSize.y/2);
            shape.setScale(x, y);

            var mask = this.add.bitmapMask(shape);

            background.setMask(mask);
            MainScene.Instance.layerHud.add(background);
        }
    }

    private createPads()
    {
        //add pads
        const distance = 0.5;
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;
            const z = this.ground.plankSize / 2;

            const pad = this.pads.addPad(x, this.pads.padHeight, z);
            pad.setKey(this.padKeys[i]);
            pad.color = this.padColors[i];
        }
    }

    public startSong(song: Song)
    {
        GameScene.Instance.soundPlayer.startSong(song);
    }

    public update(time: number, delta: number)
    {
        //ThreeScene.Instance.third.camera.position.x += 0.01
        //ThreeScene.Instance.third.camera.lookAt(0, 0, 3)

        this.soundPlayer.update(delta);
        this.ground.update();
        this.notes.update(delta);
        this.pads.update();
        this.hitAccuracy.update(delta);
        this.gameProgressBar.update(delta);
        this._guitarHud.update();
    }

    public hitCombo(note: Note, hitType: eNoteHitGood)
    {
        if(GameScene.Instance.prevHitSongNote != note.songNote)
        {
            GameScene.Instance.prevHitSongNote = note.songNote;
            GameScene.Instance.combo++;
            GameScene.Instance.hitAccuracy.setComboText(`${GameScene.Instance.combo}`);
        }

        GameScene.Instance.hitAccuracy.setHitType(hitType);
    }

    public breakCombo()
    {
        this.combo = 0;
        GameScene.Instance.hitAccuracy.setComboText(`0`);
    }

    public static saveImage()
    {

        const scene = this.Instance;

        //const canvas = scene.add.renderTexture(0, 0, 500, 500);

        ThreeScene.Instance.third.renderer.render(ThreeScene.Instance.third.scene, ThreeScene.Instance.third.camera);
        
        const canvas = ThreeScene.Instance.third.renderer.domElement;
        const url = canvas.toDataURL();
        console.log(url);

        const gl = canvas.getContext('webgl');

        if(gl)
        {
            //gl1.clearColor(1, 0, 0, 1);
            //gl1.clear(gl1.COLOR_BUFFER_BIT);

            const w = gl.canvas.width;
            const h = gl.canvas.width;

            var data = new Uint8Array(w*h*4);
            gl.readPixels(0, 0, w,h, gl.RGBA, gl.UNSIGNED_BYTE, data);

            console.log(data);
        }

        
    }
}