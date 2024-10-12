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
import { GameProgressBar } from "./gameProgressBar";
import { GuitarHud } from "./guitarHud";
import { InfoText } from "./infoText";
import { AudioManager } from "../../../utils/audioManager/audioManager";
import { Pad } from "../../pads/pad";
import { MaskProgressBar } from "../../../utils/ui/maskProgressBar";
import { eGameLogicEvents, eNoteHitGood, GameLogic, NoteData } from "../../gameface/gameLogic";
import { Note } from "../../notes/note";
import { getIsMobile } from "../../../utils/utils";
import { gameSettings } from "../../constants/gameSettings";

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;

    /*
    Events:
    pad_begin_drag
    pad_end_drag

    OBS: not working for some fucking reason
    */
    public events = new Phaser.Events.EventEmitter();

    public ground: Ground;

    public topRightContainer!: Phaser.GameObjects.Container;
    
    
    public prevHitSongNote?: SongNote;

    public get betValue() { return Gameface.Instance.gameLogic.matchData.betValue; };
    public get money() { return Gameface.Instance.gameLogic.money; };
    public get score() { return Gameface.Instance.gameLogic.score; };
    public get combo() { return Gameface.Instance.gameLogic.combo; };
    public get accumulatedMoney() { return Gameface.Instance.gameLogic.accumulatedMoney; };

    public get soundPlayer() { return this._soundPlayer; }
    public get notes() { return this._notes; }
    public get pads() { return this._pads; }
    public get hitAccuracy() { return this._hitAccuracy; }
    public get infoText() { return this._infoText; }
    //public get gameProgressBar() { return this._gameProgressBar; }
    public get guitarHud() { return this._guitarHud; }

    private _soundPlayer: SoundPlayer;
    private _notes: Notes;
    private _pads: Pads;
    private _hitAccuracy: HitAccuracy;
    private _infoText: InfoText;
    //private _gameProgressBar: GameProgressBar;
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
        this._infoText = new InfoText();
        //this._gameProgressBar = new GameProgressBar();
        this._guitarHud = new GuitarHud();

        GameScene.Instance = this;

        this.setupEvents();
    }

    public setupEvents()
    {
        this.events.on("pad_begin_drag", () => {
            
        });

        const gameLogic = Gameface.Instance.gameLogic;
        gameLogic.events.on(eGameLogicEvents.EVENT_NOTE_HIT, (noteData: NoteData, hitType: eNoteHitGood) => {

            const note = this.notes.getNoteByNoteData(noteData);

            if(!note)
            {
                throw "GameScene: note not found wtf";
            }

            this.onNoteHit(note, hitType);
        })

        gameLogic.events.on(eGameLogicEvents.EVENT_BREAK_COMBO, () => {
            this.breakCombo();
        })

        gameLogic.events.on(eGameLogicEvents.EVENT_COMBO_REWARD, () => {
            this.infoText.showRandomHitMessage();
        })

        gameLogic.events.on(eGameLogicEvents.EVENT_PAD_BEGIN_DRAG, (padIndex: number, noteData: NoteData) => {
            const pad = this.pads.getPad(padIndex)!;
            const note = this.notes.getNoteByNoteData(noteData);
            pad.startDrag(note);
        })

        gameLogic.events.on(eGameLogicEvents.EVENT_PAD_END_DRAG, (padIndex: number) => {
            const pad = this.pads.getPad(padIndex)!;
            pad.stopDrag();
        })
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

        //this.createBackground();

        this.createPads();

        //top right container
        const gameSize = Gameface.Instance.getGameSize();

        this.topRightContainer = this.add.container();
        this.topRightContainer.setPosition(gameSize.x, 0);
        Hud.addToHudLayer(this.topRightContainer);

        this.guitarHud.create();

        this.hitAccuracy.create(this);
        this.infoText.create(this);
    }

    private createBackground()
    {
        //background
        
        const gameSize = Gameface.Instance.getGameSize();

        let x = 1280/900;
        let y = 720/600;

        //reset
        x = 1;
        y = 1;

        const backgroundId = 1;
        const backgroundTextureKey = `background${backgroundId}` + (getIsMobile() ? '_mobile' : '');

        const background = this.add.image(0, 0, backgroundTextureKey);
        background.setOrigin(0.5);
        background.setPosition(gameSize.x/2, gameSize.y/2);
        background.setScale(x, y);
        MainScene.Instance.layerBackground.add(background);

        const maskTextureKey = getIsMobile() ? `mask_mobile` : `mask`;

        const shape = this.add.image(0, 0, maskTextureKey).setVisible(false);
        shape.setOrigin(0.5);
        shape.setPosition(gameSize.x/2, gameSize.y/2);
        shape.setScale(x, y);

        var mask = this.add.bitmapMask(shape);

        background.setMask(mask);
    }

    private createPads()
    {
        //add pads
        const distance = 0.5;

        const numOfPads = Gameface.Instance.gameLogic.pads.length;

        let i = 0;
        for(const padData of Gameface.Instance.gameLogic.pads)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;
            const z = this.ground.plankSize / 2;

            const pad = this.pads.addPad(x, this.pads.padHeight, z, padData);
            pad.setKey(this.padKeys[i]);
            pad.color = this.padColors[i];

            i++;
        }
    }

    public startSong(song: Song)
    {
        const gameLogic = Gameface.Instance.gameLogic;

        gameLogic.song = song;
        gameLogic.createNotes();
        GameScene.Instance.soundPlayer.startSong(song);

        this.guitarHud.createSongDetails();
    }

    public startMultiplayerSong(song: Song)
    {
        this.infoText.setText("waiting for opponent...", -1);

        setTimeout(() => {
            this.infoText.setText("Start!", 1000);

            //this.guitarHud.createSecondUser();

            setTimeout(() => {
                GameScene.Instance.soundPlayer.startSong(song);
            }, 1000);
        }, 3000);
    }

    public update(time: number, delta: number)
    {
        //ThreeScene.Instance.third.camera.position.x += 0.01
        //ThreeScene.Instance.third.camera.lookAt(0, 0, 3)

        try {
            this.updateGame(delta);
        } catch (error) {
            Gameface.Instance.onSongError(error);
            throw error;
        }
    }

    private updateGame(delta: number)
    {
        Gameface.Instance.gameLogic.songTime = this.soundPlayer.getCurrentSoundPosition();

        this.soundPlayer.update(delta);
        this.ground.update();
        this.notes.update(delta);
        this.pads.update(delta);
        this.hitAccuracy.update(delta);
        this.infoText.update(delta);
        //this.gameProgressBar.update(delta);
        this._guitarHud.update(delta);
    }

    public onNoteHit(note: Note, hitType: eNoteHitGood)
    {
        if(gameSettings.playHitSound)
            AudioManager.playAudioPhaserWithVolume("osu_hitsound", 0.1);
        
        GameScene.Instance.hitAccuracy.setHitType(hitType);

        const notesToReward = gameSettings.comboAward;
        const nextReward = (Math.floor(this.combo/ notesToReward) * notesToReward) + notesToReward;

        GameScene.Instance.hitAccuracy.setComboText(`${GameScene.Instance.combo} / ${nextReward}`);
    }

    public breakCombo()
    {
        GameScene.Instance.hitAccuracy.visibleTime = 0;
        GameScene.Instance.hitAccuracy.setComboText(`0`);

        this.infoText.showRandomMissMessage();
        this.guitarHud.moneyText.shake();
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