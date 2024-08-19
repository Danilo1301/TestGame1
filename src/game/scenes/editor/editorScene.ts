import { AssetAudio, AudioManager } from "../../../utils/audioManager/audioManager";
import { Input } from "../../../utils/input/input";
import { Button } from "../../../utils/ui/button";
import { Options } from "../../../utils/ui/options";
import { Song, SongNote, songs } from "../../constants/songs";
import { Gameface } from "../../gameface/gameface";
import { AddNote } from "./addNote";
import { BPMMeter } from "./bmpMeter";

import { Timebar } from "./timebar";
import { GameScene } from "../gameScene/gameScene";
import { Hud } from "../../hud/hud";
import { MainScene } from "../mainScene";
import { NoteOptions } from "./noteOptions";
import { Note } from "../../notes/note";

export class EditorScene extends Phaser.Scene
{
    public static Instance: EditorScene;
    public static showNoteOptionsButton: boolean = true;

    public timebar: Timebar;
    public bpmMeter: BPMMeter;
    
    //public notes: EditorNote[] = [];
    
    public song?: Song;
    
    private _bpmOptions!: Options;
    private _addNotePanel?: AddNote;

    private _noteOptions?: NoteOptions;

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
        
        Gameface.Instance.sceneManager.startScene(GameScene);
        GameScene.Instance.soundPlayer.autoFinishWhenNoMoreNotes = false;
        
        this.timebar.create(this);
        Hud.addToHudLayer(this.timebar.container);

        this.timebar.events.on("changedcurrentlength", (currentLength: number) => {
            const audio = GameScene.Instance.soundPlayer.audio!;

            if(audio.paused) audio.play();

            audio.currentTime = currentLength;
        });

        this.bpmMeter.create(this);

        const addNote = Hud.addButton("Add note", 50, 180, 80, 50, "button");
        addNote.onClick = () => {
            EditorScene.showNoteOptionsButton = false;

            this._addNotePanel = new AddNote(this);
            this._addNotePanel.onClose = () => {
                this._addNotePanel = undefined;
                EditorScene.showNoteOptionsButton = true;
            };
        };

        const snap = Hud.addButton("Snap", 50, 240, 80, 50, "button");
        snap.onClick = () => {
            this.snapToClosestBeatDivisior(0);
        };

        const speedList: number[] = [1, 0.75, 0.5, 0.25, 0.1];
        let x = 25;
        for(const speed of speedList)
        {
            const setSpeed = Hud.addButton(`x${speed.toFixed(2)}`, x, 290, 50, 30, "button");
            setSpeed.onClick = () => {
                this.setPlaybackSpeed(speed);
            };
            x += 50;
        }

        const bpmOptions = Hud.addOptions(100);
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

        // KEYBOARD KEYS ------------------------

        // SPACE
        this.input.keyboard!.on('keydown-SPACE', (event: KeyboardEvent) =>
        {
            const soundPlayer = GameScene.Instance.soundPlayer;
            const audio = soundPlayer.audio!;

            if(audio.paused)
            {
                soundPlayer.resumeSound();
            } else {
                soundPlayer.pauseSound();
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

            const timeDiff = Math.abs(soundTime - t);

            if(direction == 1)
            {
                if(t <= soundTime) continue;
                if(timeDiff < 1) continue;
            }

            if(direction == -1)
            {
                if(t >= soundTime) continue;
                if(timeDiff < 1) continue;
            }

            
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

    public openNoteOptions(time: number)
    {
        const song = this.song!;

        for(const songNote of song.notes)
        {
            if(songNote.time == time)
            {
                EditorScene.showNoteOptionsButton = false;
                const noteOptions = new NoteOptions(this, songNote);
                this._noteOptions = noteOptions;
                this._noteOptions.onClose = () => {
                    this._noteOptions = undefined;
                    EditorScene.showNoteOptionsButton = true;
                };
                break;
            }
        }
    }

    public deleteNote(songNote: SongNote)
    {
        const song = this.song!;

        let deleteIndex = song.notes.indexOf(songNote);

        if(deleteIndex >= 0)
        {
            song.notes.splice(deleteIndex, 1);
            GameScene.Instance.soundPlayer.recreateNotes();
        }
    }

    public findNextNote(songNote: SongNote)
    {   
        const song = this.song!;
 
        let sortedNotes: SongNote[] = [];

        for(const findSongNote of song.notes) sortedNotes.push(findSongNote);

        sortedNotes = sortedNotes.sort((a, b) => a.time - b.time);

        for(const findSongNote of sortedNotes)
        {
            console.log(findSongNote.time);
        }

        console.log(`sort:`);

        const originalIndex = sortedNotes.indexOf(songNote);

        sortedNotes = sortedNotes.filter((a, index) => {
            return index == originalIndex + 1;
        });

        if(sortedNotes.length == 0)
        {
            return;
        }

        const nextNote = sortedNotes[0];

        return nextNote;
    }

    public makeNoteSlider(songNote: SongNote)
    {
        console.log(`Make note slider:`, songNote);

        const nextNote = this.findNextNote(songNote);

        if(!nextNote)
        {
            console.error("Could not find next note");
            return;
        }

        const diff = nextNote.time - songNote.time;
        songNote.dragTime = diff;

        this.deleteNote(nextNote);

        GameScene.Instance.soundPlayer.recreateNotes();
    }

    public removeSlider(songNote: SongNote)
    {
        songNote.dragTime = 0;

        GameScene.Instance.soundPlayer.recreateNotes();
    }
}