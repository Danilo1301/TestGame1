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

    private _currentSoundPosition: number = -3000;
    private _hasSongStarted: boolean = false;
    private _running: boolean = false;

    public startSong(song: Song)
    {
        this._song = song;
        this._startedTime = performance.now();
        this._running = true;

        this._audio = AudioManager.playAudio(song.sound);
        //this._audio.pause();
        //this._audio.play();

        this.recreateNotes();
    }

    public getAudioCurrentTime()
    {
        return this.audio!.currentTime * 1000;
    }

    public getAudioDuration()
    {
        return this.audio!.duration * 1000;
    }

    public recreateNotes()
    {
        this.destroyNotes();

        for(const songNote of this.song!.notes)
        {
            this.createNotesForSongNote(songNote);
        }
    }

    public destroyNotes()
    {
        GameScene.Instance.notes.destroyNotes();
    }

    public update(delta: number)
    {
        if(!this._running) return;

        this._currentSoundPosition = this.getAudioCurrentTime();


        /*
        if(this._currentSoundPosition < 0)
        {
            this._currentSoundPosition += delta;
        } else {
            const time = this._currentSoundPosition;

            this._currentSoundPosition = this.getAudioCurrentTime();

            const audio = this.audio!;

            if(audio.paused)
            {
                if(!this._hasSongStarted)
                {
                    this._hasSongStarted = true;
                    audio.play();
                    audio.currentTime = time;
                }
            }
        }
        */
    }

    public getCurrentSoundPosition()
    {
        return this._currentSoundPosition;
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