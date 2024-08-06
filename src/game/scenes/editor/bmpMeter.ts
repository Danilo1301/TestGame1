import { AudioManager } from "../../../utils/audioManager/audioManager";
import { GameScene } from "../gameScene/gameScene";

export class BPMMeter
{
    /*
    * Find BPM: https://tunebat.com/Analyzer
    */
    public bpm: number = 128;
    public offset: number = 15;

    //private _lastPlayedSound: number = 0;
    private _audio!: HTMLAudioElement;
    private _lastBeatPlayed: number = -1;

    constructor()
    {

    }

    public create(scene: Phaser.Scene)
    {
        this._audio = AudioManager.playAudio("bpm");
        this._audio.pause();
    }

    public update()
    {
        const beat = this.getBeat(this.bpm, this.offset);

        let currentTime = GameScene.Instance.soundPlayer.getAudioCurrentTime();

        if(this._lastBeatPlayed != beat)
        {
            this._lastBeatPlayed = beat;

            console.log(`BEAT: currentTime: ${currentTime}`);

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    public getBeat(bpm: number, offset: number)
    {
        const perBeat = 60000/bpm;

        let currentTime = GameScene.Instance.soundPlayer.getAudioCurrentTime();
        currentTime += offset;

        const beat = Math.floor(currentTime / perBeat);

        return beat;
    }

    public getCurrentBeatTime(beatOffset: number)
    {
        const bpm = this.bpm;
        const offset = this.offset;

        const perBeat = 60000/bpm;

        let currentTime = GameScene.Instance.soundPlayer.getAudioCurrentTime();
        currentTime += offset;

        const beat = Math.floor(currentTime/perBeat) + beatOffset

        const t = beat * perBeat;

        return t;
    }
}