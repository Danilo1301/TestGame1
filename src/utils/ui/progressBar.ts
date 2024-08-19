import { Button } from "./button";

export class ProgressBar
{
    public container: Phaser.GameObjects.Container;

    public background: Phaser.GameObjects.Rectangle;
    public backgroundProgress: Phaser.GameObjects.Rectangle;
    public backgroundRest: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, width: number, height: number)
    {
        this.container = scene.add.container(0, 0);

        const margin = 3;

        const background = scene.add.rectangle(0, 0, width, height, 0x000000);
        this.background = background;
        this.container.add(background);

        const backgroundRest = scene.add.rectangle(0, 0, width - (margin*2), height - (margin*2), 0xff0000);
        this.backgroundRest = backgroundRest;
        this.container.add(backgroundRest);

        const backgroundProgress = scene.add.rectangle(0, 0, width - (margin*2), height - (margin*2), 0x00ff00);
        this.backgroundProgress = backgroundProgress;
        backgroundProgress.setPosition(-width/2 + margin, -height/2 + margin);
        backgroundProgress.setOrigin(0, 0);
        this.container.add(backgroundProgress);
    }

    public setProgressColor(color: number)
    {
        this.backgroundProgress.fillColor = color;
    }

    public setRestColor(color: number)
    {
        this.backgroundRest.fillColor = color;
    }

    public setProgress(progress: number)
    {
        this.backgroundProgress.setScale(progress, 1);
    }
}