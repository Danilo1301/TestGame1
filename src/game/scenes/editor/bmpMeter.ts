import { AudioManager } from "../../../utils/audioManager/audioManager";
import { BPMChange } from "../../constants/songs";
import { GameScene } from "../gameScene/gameScene";
import { BPMBar } from "./bpmBar";

export class BPMKeyCounter {

    public lastHit: number = 0;
    public averageHits: number[] = [];

    constructor()
    {
        
    }

    public setupEvents()
    {
        GameScene.Instance.events.on("pad_down", () => {

            const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
            const lastHit = this.lastHit;

            this.lastHit = time;

            if(lastHit != 0)
            {
                const diff = Math.abs(time - lastHit);

                this.averageHits.push(diff);

                if(diff > 1000)
                {
                    this.averageHits = [];
                    this.lastHit = 0;
                }
            }

            let total = 0;
            for(const t of this.averageHits) total += t;

            let avg = total / this.averageHits.length;

            const beatsPerSecond = 1000 / avg;
            const beatsPerMinute = beatsPerSecond * 60;

            console.log(this.averageHits);
            console.log("avg", avg);
            console.log("beatsPerMinute", beatsPerMinute);
        })
    }
}

export class BPMMeter
{
    public bpms: BPMChange[] = [];
    public offset: number = 15;

    public playBpmSound: boolean = true;

    public bpmDivision = 1/2;

    public bpmBars: BPMBar[] = [];
    public bpmDivisionBars: BPMBar[] = [];

    //private _lastPlayedSound: number = 0;
    private _audio!: HTMLAudioElement;
    private _lastBeatPlayed: number = -1;

    public bpmKeyCounter: BPMKeyCounter;

    constructor()
    {
        this.bpmKeyCounter = new BPMKeyCounter();
    }

    public create(scene: Phaser.Scene)
    {
        this._audio = AudioManager.playAudioWithVolume("bpm", 0.05);
        this._audio.pause();
    }

    public update()
    {
        const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        const bpm = this.getBPMOfTime(time);

        //console.log(`time=${time.toFixed(1)} bpm=${bpm}`)

        var bpmBarIndex = 0;

        for(var i = 0; i < this.bpms.length; i++)
        {
            const bpmChange = this.bpms[i];
            const nextBpmChange: BPMChange | undefined = this.bpms[i+1];

            const soundFinishTime = GameScene.Instance.soundPlayer.getAudioDuration();

            const startTime = bpmChange.time;
            const endTime = nextBpmChange ? nextBpmChange.time : soundFinishTime;

            const timeDuration = endTime - startTime;

            const beats = this.getHowManyBeatsInTimeDuration(bpmChange.bpm, timeDuration);

            //console.log("current", bpmChange)
            //console.log("next", nextBpmChange)
            //console.log(startTime, "->", endTime)
            //console.log("beats", beats)

            const minBeats = Math.floor(beats);

            for(var beatI = 0; beatI <= minBeats; beatI++)
            {
                const durationOfOneBeat = this.getTimeDurationOfOneBeat(bpmChange.bpm);
                const timePos = startTime + beatI * durationOfOneBeat;

                const bpmBar = this.createBpmBar(bpmBarIndex++);
                bpmBar.timeMs = timePos;
                bpmBar.image.tint = i % 2 == 0 ? 0xff0000 : 0x0000ff;
                bpmBar.scale = 1.5;
                bpmBar.update();

                if(beatI == minBeats) continue;

                const divideIn = 1 / this.bpmDivision;

                for(var beatDivI = 1; beatDivI < divideIn; beatDivI++)
                {
                    let divTimePos = timePos + (beatDivI * (durationOfOneBeat / divideIn));

                    const bpmBarDiv = this.createBpmBar(bpmBarIndex++);
                    bpmBarDiv.timeMs = divTimePos;
                    bpmBarDiv.scale = 0.5;
                    bpmBarDiv.update();
                }
            }
        }
    }

    public createBpmBar(index: number)
    {
        const scene = GameScene.Instance;

        if(index < this.bpmDivisionBars.length)
        {
            return this.bpmDivisionBars[index];
        }

        const bpmBar = new BPMBar(scene);
        this.bpmDivisionBars.push(bpmBar);
        return bpmBar;
    }

    public getTimeDurationOfOneBeat(bpm: number)
    {
        const beatsPerMinute = bpm;
        const beatsPerSecond = beatsPerMinute / 60;

        const beatDurationInOneSecond = 1 / beatsPerSecond;

        return beatDurationInOneSecond * 1000;
    }

    public getBPMOfTime(time: number)
    {
        let currentBpm = this.bpms[0];

        for(var i = 0; i < this.bpms.length; i++)
        {
            const bpm = this.bpms[i];

            if(bpm.time <= time) currentBpm = bpm;
            
            //console.log(i, bpm.time);
        }

        return currentBpm.bpm;
    }

    public getHowManyBeatsInTimeDuration(bpm: number, time: number)
    {
        const beatsPerMinute = bpm;
        const beatsPerSecond = beatsPerMinute / 60;

        const seconds = time / 1000;

        return beatsPerSecond * seconds;
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
        return 0;
    }
}