import { AssetAudio, AudioManager } from "../../utils/audioManager/audioManager";
import { Input } from "../../utils/input/input";
import { Button } from "../../utils/ui/button";
import { Song, SongNote, songs } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { Note } from "../notes/note";
import { AddNote } from "./editor/addNote";
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

    public notes: EditorNote[] = [];

    public song?: Song;

    constructor()
    {
        super({});
        
        EditorScene.Instance = this;

        this.timebar = new Timebar();
    }

    public setSong(song: Song)
    {
        this.song = Object.assign({}, song);

        GameScene.Instance.soundPlayer.startSong(this.song);
    }

    public async create()
    {
        console.log("create")
        
        this.timebar.create(this);
        this.timebar.events.on("changedcurrentlength", (currentLength: number) => {
            console.log(currentLength)

            const soundInstance = GameScene.Instance.soundPlayer.soundInstance!;

            console.log(soundInstance.playState)

            if(soundInstance.playState == "playFinished") soundInstance.play();

            soundInstance.position = currentLength;
        });

        const addNote = new Button(this, "Add note", 50, 180, 80, 50, "button");
        addNote.onClick = () => {
            const addNotePanel = new AddNote(this);
        };

        Gameface.Instance.sceneManager.startScene(GameScene);




        /*
        for(const songNote of this.song.notes)
        {
            for(const pad of songNote.pads)
            {
                const note = GameScene.Instance.notes.spawnNoteForPad(pad, songNote); 
                note.canMove = false;

                const editorNote: EditorNote = {
                    note: note,
                    songNote: songNote
                }

                this.notes.push(editorNote);
            }
        }
        */

        this.input.keyboard!.on('keydown-SPACE', (event: KeyboardEvent) =>
        {
            const soundInstance = GameScene.Instance.soundPlayer.soundInstance!;

            if(soundInstance.paused)
            {
                soundInstance.play();
                soundInstance.position = this.timebar.currentLength;
            } else {
                soundInstance.paused = true;
            }
        });
    }

    public update(time: number, delta: number)
    {
        this.timebar.update();

        const soundInstance = GameScene.Instance.soundPlayer.soundInstance;

        if(soundInstance)
        {
            this.timebar.currentLength = soundInstance.position;
            this.timebar.totalLength = soundInstance.duration;
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