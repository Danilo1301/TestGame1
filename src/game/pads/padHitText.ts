import { Graph } from "../../utils/graph";

export class PadHitText {
    public container: Phaser.GameObjects.Container;
    public text: Phaser.GameObjects.Text;

    public positionYGraph: Graph = new Graph();
    public timeVisible: number = 0;

    constructor(scene: Phaser.Scene)
    {
        const container = scene.add.container();
        this.container = container;

        const text = scene.add.text(0, 0, '+1');
        text.setFontFamily('Arial');
        text.setFontSize(40);
        text.setColor('#ffffff');
        text.setOrigin(0.5);
        text.setStroke('#000000', 8);
        container.add(text);
        this.text = text;

        this.positionYGraph.add(0, 100);
        this.positionYGraph.add(-100, 100);
        this.positionYGraph.add(-80, 0);
    }

    public update(delta: number)
    {
        this.timeVisible -= delta;

        this.positionYGraph.changeCurrentTimeBy(delta);

        this.text.setPosition(0, this.positionYGraph.getValue());
        this.text.setVisible(this.timeVisible > 0);
    }

    public show()
    {
        this.positionYGraph.currentTime = 0;
        this.timeVisible = 300;
    }
}