import { AudioManager } from "../../utils/audioManager/audioManager";
import { BaseObject } from "../../utils/baseObject";
import { Song, SongNote, songs } from "../constants/songs";
import { GameScene } from "../scenes/gameScene";

export class SoundNotes extends BaseObject
{
    public soundDelay: number = 2000;
    
    public get startedTime() { return this._startedTime; };
    public get song() { return this._song; };
    public get audio() { return this._audio; };
    
    private _song?: Song;
    private _audio?: HTMLAudioElement;
    
    private _startedTime: number = 0;
    private _currentAudioTime: number = -3;
    //private _lastCreatedNote?: SongNote;
    private _hasSongStarted: boolean = false;

    constructor()
    {
        super();
    }

    public getCurrentAudioTime()
    {
        return this._currentAudioTime;
    }

    public startSong(song: Song)
    {
        this._song = song;
        this._startedTime = performance.now();

        this._audio = AudioManager.assets.get(song.sound)!.audio!;

        this._audio.play();
        this._audio.pause();

        for(const songNote of song.notes)
        {
            this.createNotesForSongNote(songNote);
        }
    }

    public update(delta: number)
    {
        if(this._currentAudioTime < 0)
        {
            this._currentAudioTime += delta/1000;
        } else {
            const time = this._currentAudioTime;
            this._currentAudioTime = this._audio!.currentTime;

            if(this._audio?.paused)
            {
                if(!this._hasSongStarted)
                {
                    this._hasSongStarted = true;
                    this._audio.play();
                    this._audio.currentTime = time;
                    

                    //alert('play');
                }

            }
        }


        /*
        const note = this.getNextNote();

        if(!note) return;

        if(note != this._lastCreatedNote)
        {
            this._lastCreatedNote = note;

            console.log(note);

            this.createNotesForSongNote(note);
        }
        */
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
            const note = GameScene.Instance.notes.spawnNoteForPad(padIndex, songNote);
            const dragSize = GameScene.Instance.notes.getDistanceFromMs(songNote.dragTime);
            note.setDragSize(dragSize);
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