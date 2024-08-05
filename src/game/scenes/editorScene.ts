import { AssetAudio, AudioManager } from "../../utils/audioManager/audioManager";
import { Input } from "../../utils/input/input";
import { Song, SongNote, songs } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { Note } from "../notes/note";
import { Timebar } from "./editor/timebar";
import { GameScene } from "./gameScene";

interface EditorNote {
    note: Note
    songNote: SongNote
}

export class EditorScene extends Phaser.Scene
{
    public static Instance: EditorScene;
    public song: Song;
    public assetAudio!: AssetAudio;
    public timebar: Timebar;

    public notes: EditorNote[] = [];

    constructor()
    {
        super({});
        
        EditorScene.Instance = this;

        this.song = songs[0];
        this.timebar = new Timebar();
    }

    public async create()
    {
        console.log("create")
        
        AudioManager.playAudioWithVolume(this.song.sound, 0.05);

        const audioAsset = AudioManager.assets.get(this.song.sound);
        this.assetAudio = audioAsset!;
        
        console.log(audioAsset)

        console.log(this.timebar)
        console.log(this.timebar.create)
        console.log(this.timebar.create(this))

        this.timebar.create(this);
        this.timebar.events.on("changedcurrentlength", (currentLength: number) => {
            console.log(currentLength)

            const audio = audioAsset!.audio!;

            if(audio.ended)
            {
                audio.play();
            }

            audioAsset!.audio!.currentTime = currentLength;
        });

        Gameface.Instance.sceneManager.startScene(GameScene);

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

        this.input.keyboard!.on('keydown-SPACE', (event: KeyboardEvent) =>
        {
            const audio = this.assetAudio.audio!;

            if(audio.paused)
            {
                audio.play();
                audio.currentTime = this.timebar.currentLength;
            } else {
                audio.pause();
            }
        });
    }

    public update(time: number, delta: number)
    {
        this.timebar.update();

        this.timebar.currentLength = this.assetAudio.audio!.currentTime;
        this.timebar.totalLength = this.assetAudio.audio!.duration;

        //console.log(this.timebar.currentLength + " / " + this.timebar.totalLength)

        for(const editorNote of this.notes)
        {
            const pad = GameScene.Instance.pads.getPad(editorNote.note.padIndex);

            let z = pad.object.object.position.z;

            let ms = (this.timebar.currentLength * 1000) - editorNote.songNote.time;

            z += GameScene.Instance.notes.getDistanceFromMs(ms);

            const position = editorNote.note.object.object.position;
            editorNote.note.object.object.position.set(position.x, position.y, z);
        }
    }

    public setPlaybackSpeed(speed: number)
    {
        this.assetAudio.audio!.playbackRate = speed;
    }
}