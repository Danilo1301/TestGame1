import { AssetAudio, AudioManager } from "../../utils/audioManager/audioManager";
import { Input } from "../../utils/input/input";
import { Button } from "../../utils/ui/button";
import { Options } from "../../utils/ui/options";
import { Song, SongNote, songs } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { Note } from "../notes/note";
import { AddNote } from "./editor/addNote";
import { BPMMeter } from "./editor/bmpMeter";
import { BPMBar } from "./editor/bpmBar";
import { Timebar } from "./editor/timebar";
import { GameScene } from "./gameScene/gameScene";
import { MainScene } from "./mainScene";

interface EditorNote {
    note: Note
    songNote: SongNote
}

export class EditorScene extends Phaser.Scene
{
    public static Instance: EditorScene;
    public timebar: Timebar;
    public bpmMeter: BPMMeter;

    //public notes: EditorNote[] = [];

    public song?: Song;

    private _bpmOptions!: Options;

    constructor()
    {
        super({});
        
        EditorScene.Instance = this;

        this.timebar = new Timebar();
        this.bpmMeter = new BPMMeter();
    }

    public setSong(song: Song)
    {
        this.song = Object.assign({}, song);
        this.bpmMeter.bpm = song.bpm;
        this.bpmMeter.offset = song.offset;

        GameScene.Instance.soundPlayer.startSong(this.song);

        this.exportSong();
    }

    public async create()
    {
        console.log("create")
        
        this.timebar.create(this);
        this.timebar.events.on("changedcurrentlength", (currentLength: number) => {
            console.log(currentLength)

            const audio = GameScene.Instance.soundPlayer.audio!;

            //console.log(soundInstance.playState)

            //if(soundInstance.playState == "playFinished") soundInstance.play();

            if(audio.paused) audio.play();

            audio.currentTime = currentLength;
        });

        this.bpmMeter.create(this);

        const addNote = new Button(this, "Add note", 50, 180, 80, 50, "button");
        addNote.onClick = () => {
            const addNotePanel = new AddNote(this);
        };

        const snap = new Button(this, "Snap", 50, 240, 80, 50, "button");
        snap.onClick = () => {
            this.snapToClosestBeatDivisior(0);
        };

        const speedList: number[] = [1, 0.75, 0.5, 0.25, 0.1];
        let x = 25;
        for(const speed of speedList)
        {
            const setSpeed = new Button(this, `x${speed.toFixed(2)}`, x, 290, 50, 30, "button");
            setSpeed.onClick = () => {
                this.setPlaybackSpeed(speed);
            };
            x += 50;
        }

        const bpmOptions = new Options(this, 100);
        bpmOptions.addOption("1/2", 1/2);
        bpmOptions.addOption("1/3", 1/3);
        bpmOptions.addOption("1/4", 1/4);
        bpmOptions.addOption("1/5", 1/5);
        bpmOptions.addOption("1/8", 1/8);
        bpmOptions.addOption("1/12", 1/12);
        bpmOptions.onOptionChange = () => {
            this.bpmMeter.bpmDivision = bpmOptions.getCurrentOptionValue();
        };
        this._bpmOptions = bpmOptions;

        Gameface.Instance.sceneManager.startScene(GameScene);

        // KEYBOARD KEYS ------------------------

        // SPACE
        this.input.keyboard!.on('keydown-SPACE', (event: KeyboardEvent) =>
        {
            const audio = GameScene.Instance.soundPlayer.audio!;

            if(audio.paused)
            {
                audio.play();
                
            } else {
                audio.pause();
            }
            audio.currentTime = this.timebar.currentLength;
        });

        // UP / DOWN
        this.input.keyboard!.on('keydown-UP', (event: KeyboardEvent) =>
        {
            this.snapToClosestBeatDivisior(1);
        });

        this.input.keyboard!.on('keydown-DOWN', (event: KeyboardEvent) =>
        {
            this.snapToClosestBeatDivisior(-1);
        });
    }

    

    public update(time: number, delta: number)
    {
        this.timebar.update();
        this.bpmMeter.update();

        this._bpmOptions.update();

        const soundPlayer = GameScene.Instance.soundPlayer;

        this.timebar.currentLength = soundPlayer.getAudioCurrentTime() / 1000;
        this.timebar.totalLength = soundPlayer.getAudioDuration() / 1000;
    }

    public setPlaybackSpeed(speed: number)
    {
        GameScene.Instance.soundPlayer.audio!.playbackRate = speed;
    }

    /*
    1 = next beat
    0 = closest beat
    -1 = previous beat
    */
    public snapToClosestBeatDivisior(direction: number)
    {
        const soundPlayer = GameScene.Instance.soundPlayer;
        const numDivisions = (1 / this.bpmMeter.bpmDivision) + 1;

        const soundTime = soundPlayer.getAudioCurrentTime();

        let snapToTime = soundTime; //default
        let closestTimeDiff = Infinity;
        
        console.log(`soundTime=${soundTime}`);
        
        for(let i = -1; i < numDivisions; i++)
        {
            const t = this.bpmMeter.getCurrentBeatTime((i * this.bpmMeter.bpmDivision));

            if(direction == 1)
            {
                if(t <= soundTime) continue;
            }

            if(direction == -1)
            {
                if(t >= soundTime) continue;
            }

            const timeDiff = Math.abs(soundTime - t);
            if(timeDiff < closestTimeDiff)
            {
                closestTimeDiff = timeDiff;
                snapToTime = t;
            }
            
            console.log(`t=${t}`);
        }
        
        soundPlayer.audio!.currentTime = snapToTime / 1000;
    }

    public exportSong()
    {
        const song = this.song!;

        let str = "";
        for(const songNote of song.notes)
        {
            str += ` {time: ${songNote.time}, pads: ${JSON.stringify(songNote.pads)}, dragTime: ${songNote.dragTime}},\n`;
        }

        console.log(str);
    }

    public deleteNote(time: number)
    {
        const song = this.song!;

        let deleteIndex = -1;

        for(const songNote of song.notes)
        {
            if(songNote.time == time)
            {
                deleteIndex = song.notes.indexOf(songNote);
            }
        }

        if(deleteIndex != -1)
        {
            song.notes.splice(deleteIndex, 1);
            GameScene.Instance.soundPlayer.recreateNotes();
        }
    }
}