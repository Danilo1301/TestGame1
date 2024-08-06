import { AssetAudio, AudioManager } from "../../utils/audioManager/audioManager";
import { Input } from "../../utils/input/input";
import { Button } from "../../utils/ui/button";
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

    public notes: EditorNote[] = [];

    public song?: Song;

    public bpmBars: BPMBar[] = [];

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

        Gameface.Instance.sceneManager.startScene(GameScene);

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
    }

    public update(time: number, delta: number)
    {
        this.timebar.update();
        this.bpmMeter.update();

        const soundPlayer = GameScene.Instance.soundPlayer;

        this.timebar.currentLength = soundPlayer.getAudioCurrentTime() / 1000;
        this.timebar.totalLength = soundPlayer.getAudioDuration() / 1000;
        
        while(this.bpmBars.length < 3)
        {
            const bpmBar = new BPMBar(this);

            this.bpmBars.push(bpmBar);
        }

        for(const bpmBar of this.bpmBars)
        {
            const index = this.bpmBars.indexOf(bpmBar);
            const length = this.bpmBars.length;
            //const off = Math.floor(length/2);

            const soundTime = soundPlayer.getAudioCurrentTime();
            //const beat = this.bpmMeter.getBeatTime(this.bpmMeter.bpm, this.bpmMeter.offset);

            let t = soundTime;

            t -= this.bpmMeter.getCurrentBeatTime(index);   

        
            bpmBar.setTimeMs(t);
            bpmBar.update();
        }


        //console.log(this.timebar.currentLength + " / " + this.timebar.totalLength)

        /*
        for(const editorNote of this.notes)
        {
            const pad = GameScene.Instance.pads.getPad(editorNote.note.padIndex);

            let z = pad.object.object.position.z;

            let ms = (this.timebar.currentLength * 1000) - editorNote.songNote.time;

            z += GameScene.Instance.notes.getDistanceFromMs(ms);

            const position = editorNote.note.object.object.position;
            editorNote.note.object.object.position.set(position.x, position.y, z);
        }
        */
    }

    public setPlaybackSpeed(speed: number)
    {
        //GameScene.Instance.soundPlayer.soundInstance!. audio!.playbackRate = speed;
    }
}