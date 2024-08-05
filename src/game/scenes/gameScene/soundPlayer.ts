import { AudioManager } from "../../../utils/audioManager/audioManager";
import { Song, SongNote } from "../../constants/songs";
import { GameScene } from "./gameScene";

export class SoundPlayer
{
    public soundDelay: number = 2000;
    
    public get song() { return this._song; };
    public get audio() { return this._audio; };
    public get startedTime() { return this._startedTime; };
    
    private _song?: Song;
    private _audio?: HTMLAudioElement;
    private _startedTime: number = 0;

    private _currentAudioTime: number = -3;
    private _hasSongStarted: boolean = false;
    private _running: boolean = false;

    public startSong(song: Song)
    {
        this._song = song;
        this._startedTime = performance.now();
        this._running = true;

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
        if(!this._running) return;

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
                }
            }
        }
    }

    public getCurrentAudioTime()
    {
        return this._currentAudioTime;
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
}


/*
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
*/