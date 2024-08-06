import { Timebar } from "./editor/timebar";

export class AudioTestScene extends Phaser.Scene
{
    public timebar: Timebar;
    public audio?: HTMLAudioElement;

    constructor()
    {
        super({});

        this.timebar = new Timebar();
    }

    public async create()
    {
        console.log("create");

        this.timebar.create(this);

        const audio = new Audio("/assets/sound1.ogg");
        this.audio = audio;
        audio.play();
    }

    public update(time: number, delta: number)
    {
        this.timebar.currentLength = this.audio!.currentTime;
        this.timebar.totalLength = this.audio!.duration;
        this.timebar.update();

        this.timebar.events.on("changedcurrentlength", (currentLength: number) => {
            console.log(currentLength)

            if(this.audio!.paused) this.audio!.play();

            this.audio!.currentTime = currentLength;
        });
    }
}