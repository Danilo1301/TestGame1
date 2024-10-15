import { AudioManager } from "../../../utils/audioManager/audioManager";
import { Song, SongNote } from "../../constants/songs";
import { Gameface } from "../../gameface/gameface";
import { GameScene } from "./gameScene";

export class SoundPlayer
{
    //public soundDelay: number = 2000; // ?
    public static audioTimeDelay: number = 100; // delay to fix difference between Unity editor and the game
    public autoFinishWhenNoMoreNotes = true;
    
    public get song() { return this._song; };
    public get audio() { return this._audio; };
    public get startedTime() { return this._startedTime; };
    
    private _song?: Song;
    private _audio?: HTMLAudioElement;
    private _startedTime: number = 0;

    private _currentSoundPosition: number = -3000;
    //private _hasSongStarted: boolean = false;
    private _running: boolean = false;

    public startSong(song: Song)
    {
        this._song = song;
        this._startedTime = performance.now();
        this._running = true;

        this._audio = AudioManager.playAudio(song.sound);
        this._audio.volume = 0.05;

        //this._audio.pause();
        //this._audio.play();

        this.recreateNotes();
    }

    public pauseSound()
    {
        const audio = this.audio!;
        audio.pause();
    }

    public resumeSound()
    {
        const audio = this.audio!;
        audio.play();
    }

    public isRunning()
    {
        return this._running;
    }

    public getCurrentSoundPosition()
    {
        return this._currentSoundPosition + SoundPlayer.audioTimeDelay;
    }

    public getRealAudioCurrentTime()
    {
        if(!this._running) return 0;

        return this.audio!.currentTime * 1000;
    }

    public getAudioDuration()
    {
        return this.audio!.duration * 1000;
    }

    public recreateNotes()
    {
        this.destroyNotes();

        const gameLogic = Gameface.Instance.gameLogic;

        for(const noteData of gameLogic.notes)
        {
            const note = GameScene.Instance.notes.spawnNote(noteData);
            const dragSize = GameScene.Instance.notes.getDistanceFromMs(noteData.songNote.dragTime);
            note.setDragSize(dragSize);
        }
    }

    public destroyNotes()
    {
        GameScene.Instance.notes.destroyNotes();
    }

    public update(delta: number)
    {
        if(!this._running) return;

        this._currentSoundPosition = this.getRealAudioCurrentTime();

        if(this.autoFinishWhenNoMoreNotes)
        {
            //finish game
            const time = this.getRealAudioCurrentTime();
            //console.log("time:", time);

            const finishTime = this.getFinishTime();
            //console.log("finishTime:", finishTime);

            const finishDelay = 1000;

            if(time >= (finishTime + finishDelay) || this._audio!.ended)
            {
                this._audio?.pause();
                console.log("finish");

                this._running = false;

                Gameface.Instance.onSongEnd();
            }
        }
    }

    public getFinishTime()
    {
        const notes = GameScene.Instance.notes;
        const lastNote = notes.getLastNote();

        let finishTime = lastNote.songNote.time + lastNote.songNote.dragTime;

        let soundFinishTime = this.getAudioDuration();

        if(soundFinishTime < finishTime) finishTime = soundFinishTime;

        if(Gameface.Instance.gameLogic.demoSongDuration != undefined)
            return Gameface.Instance.gameLogic.demoSongDuration;

        return finishTime;
    }
    
    public getElapsedTime()
    {
        const now = performance.now();
        return now - this._startedTime;
    }

    public crashGame()
    {
        this._audio = undefined;
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