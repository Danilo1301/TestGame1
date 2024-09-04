import { Graph } from "../../../utils/graph";

export class MoneyText {
    
    public container: Phaser.GameObjects.Container;
    public text: Phaser.GameObjects.Text;
    public accumulatedMoneyText: Phaser.GameObjects.Text;

    public shakeGraph: Graph = new Graph();

    public defaultColor: string = "#0EFF6E";

    public timeToChangeColor: number = 0;

    constructor(scene: Phaser.Scene)
    {
        const container = scene.add.container();
        this.container = container;

        const money = scene.add.text(0, 0, 'R$ 0,00');
        money.setFontFamily('Brush Script MT');
        money.setFontStyle("bold");
        money.setFontSize(40);
        money.setColor(this.defaultColor);
        money.setOrigin(1, 0.5);
        money.setStroke('#000000', 4);
        container.add(money);
        this.text = money;

        const accumulatedMoney = scene.add.text(-20, 50, '+ R$ 0,00');
        accumulatedMoney.setFontFamily('Brush Script MT');
        accumulatedMoney.setFontStyle("bold");
        accumulatedMoney.setFontSize(30);
        accumulatedMoney.setColor(this.defaultColor);
        accumulatedMoney.setOrigin(0.5);
        accumulatedMoney.setStroke('#000000', 4);
        container.add(accumulatedMoney);
        this.accumulatedMoneyText = accumulatedMoney;

        this.shakeGraph.add(0, 50);
        this.shakeGraph.add(-20, 50);
        this.shakeGraph.add(20, 50);
        this.shakeGraph.add(-20, 50);
        this.shakeGraph.add(20, 50);
        this.shakeGraph.add(0, 50);
        this.shakeGraph.setTimeToEnd();
    }

    public update(delta: number)
    {
        this.shakeGraph.changeCurrentTimeBy(delta);

        this.text.setPosition(this.shakeGraph.getValue(), 0);

        if(this.timeToChangeColor > 0)
        {
            this.timeToChangeColor -= delta;

            if(this.timeToChangeColor <= 0)
            {
                this.setColor(this.defaultColor);
            }
        }
    }

    public shake()
    {
        this.setColor("#ff0000");
        this.shakeGraph.currentTime = 0;
        this.timeToChangeColor = 300;
    }

    public setColor(color: string)
    {
        this.text.setColor(color);
    }
}