import { BaseObject } from "../../../utils/baseObject";
import { Input } from "../../../utils/input/input";
import { msToTime } from "../../../utils/utils";

export class Timebar extends BaseObject
{
    public events = new Phaser.Events.EventEmitter();
    public size = new Phaser.Math.Vector2(800, 40);

    public currentLength: number = 120.0;
    public totalLength = 1524.0;

    public container!: Phaser.GameObjects.Container;
    public indicator!: Phaser.GameObjects.Rectangle;
    public timeText!: Phaser.GameObjects.Text;

    constructor()
    {
        super();
    }

    public create(scene: Phaser.Scene)
    {
        const container = scene.add.container(0, 0);
        this.container = container;

        container.setPosition(10, 40);

        const background = scene.add.rectangle(0, 0, this.size.x, this.size.y, 0x646400);
        background.setOrigin(0);
        container.add(background);

        const indicator = scene.add.rectangle(0, 0, 2, this.size.y - 10, 0xffffff);
        indicator.setOrigin(0.5, 0);
        container.add(indicator);
        this.indicator = indicator;

        const timeText = scene.add.text(0, this.size.y/2, "0:00:00");
        timeText.setOrigin(0, 0.5);
        container.add(timeText);
        this.timeText = timeText;

        Input.events.on("pointerdown", () => {
            
            const mousePosition = Input.mousePosition;
            const containerPos = new Phaser.Math.Vector2(container.x, container.y);
            const isInside = Input.isPointInsideRect(Input.mousePosition, containerPos, this.size);

            if(isInside)
            {
                const xDiff = mousePosition.x - containerPos.x;
                const xPos = xDiff / this.size.x;

                this.currentLength = xPos * this.totalLength;

                console.log(`timebar changed length to ${this.currentLength} / ${this.totalLength}`)

                this.events.emit("changedcurrentlength", this.currentLength);
            }
        });
    }

    public update()
    {
        this.updateIndicatorPosition();

        this.timeText.setText(msToTime(this.currentLength * 1000));
    }

    public updateIndicatorPosition()
    {
        const indicator = this.indicator;

        const x = this.currentLength / this.totalLength * this.size.x;
        const y = 5;

        indicator.setPosition(x, y);
    }
}