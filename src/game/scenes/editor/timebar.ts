import { BaseObject } from "../../../utils/baseObject";
import { Input } from "../../../utils/input/input";

export class Timebar extends BaseObject
{
    public events = new Phaser.Events.EventEmitter();
    public size = new Phaser.Math.Vector2(500, 40);

    public currentLength: number = 120.0;
    public totalLength = 1524.0;

    public indicator!: Phaser.GameObjects.Rectangle;

    constructor()
    {
        super();
    }

    public create(scene: Phaser.Scene)
    {
        const container = scene.add.container(0, 0);

        container.setPosition(10, 40);

        const background = scene.add.rectangle(0, 0, this.size.x, this.size.y, 0x000000);
        background.setOrigin(0);
        container.add(background);

        const indicator = scene.add.rectangle(0, 0, 2, this.size.y - 10, 0xffffff);
        indicator.setOrigin(0.5, 0);
        container.add(indicator);
        this.indicator = indicator;

        Input.events.on("pointerdown", () => {
            
            const mousePosition = Input.mousePosition;
            const containerPos = new Phaser.Math.Vector2(container.x, container.y);
            const isInside = Input.isPointInsideRect(Input.mousePosition, containerPos, this.size);

            if(isInside)
            {
                const xDiff = mousePosition.x - containerPos.x;
                const xPos = xDiff / this.size.x;

                this.currentLength = xPos * this.totalLength;

                this.events.emit("changedcurrentlength", this.currentLength);
            }
        });
    }

    public update()
    {
        this.updateIndicatorPosition();
    }

    public updateIndicatorPosition()
    {
        const indicator = this.indicator;

        const x = this.currentLength / this.totalLength * this.size.x;
        const y = 5;

        indicator.setPosition(x, y);
    }
}