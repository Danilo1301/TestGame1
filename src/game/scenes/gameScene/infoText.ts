import { BaseObject } from "../../../utils/baseObject";
import { Graph } from "../../../utils/graph";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";

export class InfoText extends BaseObject
{
    public text!: Phaser.GameObjects.Text;
    public scaleGraph: Graph = new Graph();
    public visibleTime: number = 0;
    constructor()
    {
        super();

        this.scaleGraph.add(0.5, 100);
        this.scaleGraph.add(1.3, 100);
        this.scaleGraph.add(1.0, 0);
    }

    public create(scene: Phaser.Scene)
    {
        const gameSize = Gameface.Instance.getGameSize();

        const text = scene.add.text(gameSize.x / 2, 100, 'INFO_TEXT');
        text.setFontFamily('Arial');
        text.setFontSize(40);
        text.setColor('#ffffff');
        text.setOrigin(0.5);
        text.setStroke('#000000', 8);
        this.text = text;
        Hud.addToHudLayer(text);
    }

    public update(delta: number)
    {
        this.scaleGraph.changeCurrentTimeBy(delta);

        if(this.visibleTime > 0)
        {
            this.visibleTime -= delta;
            if(this.visibleTime < 0) this.visibleTime = 0;
        }

        this.text.setScale(this.scaleGraph.getValue());
        this.text.setVisible(this.visibleTime > 0 || this.visibleTime == -1);
    }

    public setText(str: string, time: number)
    {
        this.visibleTime = time;
        this.text.setText(str);
        this.scaleGraph.currentTime = 0;
    }

    public setColor(color: number)
    {
        const hexString = color.toString(16);
        this.text.setColor(`#${hexString}`);
    }
}