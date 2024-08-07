import { AudioManager } from "../../../utils/audioManager/audioManager";
import { GameScene } from "../gameScene/gameScene";
import { BPMBar } from "./bpmBar";

export class BPMMeter
{
    public bpm: number = 128;
    public offset: number = 15;

    public bpmDivision = 1/2;

    public bpmBars: BPMBar[] = [];
    public bpmDivisionBars: BPMBar[] = [];

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

        //

        const scene = GameScene.Instance;
        const soundPlayer = GameScene.Instance.soundPlayer;

        //bpm bars
        
        while(this.bpmBars.length < 3)
        {
            const bpmBar = new BPMBar(scene);
            this.bpmBars.push(bpmBar);
        }

        for(const bpmBar of this.bpmBars)
        {
            const index = this.bpmBars.indexOf(bpmBar);
            const length = this.bpmBars.length;
            //const off = Math.floor(length/2);

            const soundTime = soundPlayer.getAudioCurrentTime();

            let t = soundTime;

            t -= this.getCurrentBeatTime(index);   

            bpmBar.setTimeMs(t);
            bpmBar.update();
        }

        //bpm bars divisions

        const numDivisions = (1 / this.bpmDivision) - 1;

        while(this.bpmDivisionBars.length < numDivisions)
        {
            console.log(`Current: ${this.bpmDivisionBars.length}, goal: ${numDivisions}`);

            const bpmBar = new BPMBar(scene);
            this.bpmDivisionBars.push(bpmBar);
        }
        while(this.bpmDivisionBars.length > numDivisions)
        {
            console.log(`Current: ${this.bpmDivisionBars.length}, goal: ${numDivisions}`);

            const bpmBar = this.bpmDivisionBars[0];
            bpmBar.destroy();

            this.bpmDivisionBars.splice(0, 1);
        }

        for(const bpmBar of this.bpmDivisionBars)
        {
            const index = this.bpmDivisionBars.indexOf(bpmBar);

            const soundTime = soundPlayer.getAudioCurrentTime();

            let t = soundTime;
            t -= this.getCurrentBeatTime((index + 1) * this.bpmDivision);   

            bpmBar.setTimeMs(t);
            bpmBar.scale = 0.5;
            bpmBar.update();
        }

        //console.log("divide in " + numDivions);
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