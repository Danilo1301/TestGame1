import { Song } from "../../constants/songs";
import { Notes } from "../../notes/notes";
import { Pads } from "../../pads/pads";
import { Button } from '../../../utils/ui/button';
import { Gameface } from '../../gameface/gameface';
import { SoundPlayer } from './soundPlayer';
import { Ground } from './ground';

export class GameScene extends Phaser.Scene
{
    public static Instance: GameScene;

    public ground: Ground;

    public get soundPlayer() { return this._soundPlayer; }
    public get notes() { return this._notes; }
    public get pads() { return this._pads; }

    private _soundPlayer: SoundPlayer;
    private _notes: Notes;
    private _pads: Pads;

    public canvas?: Phaser.Textures.CanvasTexture;

    public padKeys: string[] = ["A", "S", "D", "F", "G"];

    constructor()
    {
        super({});

        this.ground = new Ground();

        this._soundPlayer = new SoundPlayer();
        this._notes = new Notes();
        this._pads = new Pads();

        GameScene.Instance = this;
    }

    public async create()
    {
        this.ground.create();

        //add pads
        const distance = 0.5;
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const totalDistance = (numOfPads-1) * distance;
            const x = i * distance - totalDistance/2;
            const z = this.ground.plankSize / 2;

            const pad = this.pads.addPad(x, 0.2, z);
            pad.setKey(this.padKeys[i]);
        }

        //test
        //const note = this.notes.spawnRandomNoteForPad();
        //console.log(note.getScale())

        const button = new Button(this, "Fullscreen", 30, 120, 50, 50, "button");
        button.onClick = () => {
            Gameface.Instance.toggleFullscreen();
        };

    }

    public startSong(song: Song)
    {
        GameScene.Instance.soundPlayer.startSong(song);
    }

    public update(time: number, delta: number)
    {
        this.soundPlayer.update(delta);
        this.ground.update();
        this.notes.update(delta);
        this.pads.update();
    }
}