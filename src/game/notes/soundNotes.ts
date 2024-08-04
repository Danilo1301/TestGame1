import { BaseObject } from "../../utils/baseObject";
import { Song, SongNote, songs } from "../constants/songs";
import { GameScene } from "../scenes/gameScene";

export class SoundNotes extends BaseObject
{
    private _song?: Song;

    private _startedTime: number = 0;
    private _lastCreatedNote?: SongNote;
    private _running: boolean = false;

    constructor()
    {
        super();
    }

    public startSong(song: Song)
    {
        this._song = song;
        this._startedTime = performance.now();
        this._running = true;
    }

    public update(delta: number)
    {
        if(!this._running) return;

        const note = this.getNextNote();

        if(!note) return;

        if(note != this._lastCreatedNote)
        {
            this._lastCreatedNote = note;

            console.log(note);

            this.createNotesForSongNote(note);
        }
    }

    public getElapsedTime()
    {
        const now = performance.now();
        return now - this._startedTime;
    }

    public createNotesForSongNote(songNote: SongNote)
    {
        for(const padIndex of songNote.pads)
        {
            GameScene.Instance.notes.spawnNoteForPad(padIndex);
        }
    }

    public getNextNote()
    {
        const time = this.getElapsedTime();

        //console.log(time);

        const song = this._song;

        if(!song) return;

        for(const note of song.notes)
        {
            const index = song.notes.indexOf(note);

            const nextNote = song.notes[index + 1];

            if(nextNote)
            {
                if(time > nextNote.time) continue;  
            }

            //if(time < note.time) continue;

            return note;
        }

        return;
    }
}