import { BaseObject } from "../../../utils/baseObject";
import { Graph } from "../../../utils/graph";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";
import { eNoteHitGood } from "../../notes/note";

interface AccuracyInfo {
    text: string
    color: number
}

export class HitAccuracy extends BaseObject
{
    public text!: Phaser.GameObjects.Text;
    public comboText!: Phaser.GameObjects.Text;
    public scaleGraph: Graph = new Graph();
    public visibleTime: number = 0;
    public accuracyInfo = new Map<eNoteHitGood, AccuracyInfo>([
        [eNoteHitGood.HIT_PERFECT, { text: "PERFECT", color: 0x9000FF }],
        [eNoteHitGood.HIT_GOOD, { text: "GOOD", color: 0x74BF13 }],
        [eNoteHitGood.HIT_OK, { text: "OK", color: 0x808080 }],
        [eNoteHitGood.HIT_BAD, { text: "BAD", color: 0X808080 }],
        [eNoteHitGood.HIT_NOT_ON_TIME, { text: "BRUH", color: 0X808080 }],
    ]);

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

        const text = scene.add.text(gameSize.x / 2, 100, 'HIT_ACCURACY').setFontFamily('Arial');
        this.text = text;
        Hud.addToHudLayer(text);
        
        text.setFontSize(40);
        text.setColor('#ffffff');
        text.setOrigin(0.5);
        text.setStroke('#000000', 8);

        const comboText = scene.add.text(gameSize.x / 2, 150, 'SCORE').setFontFamily('Arial');
        comboText.setFontSize(40);
        comboText.setColor('#ffffff');
        comboText.setOrigin(0.5);
        comboText.setStroke('#000000', 8);
        this.comboText = comboText;
        Hud.addToHudLayer(comboText);
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
        this.text.setVisible(this.visibleTime > 0);
        
        this.comboText.setScale(this.scaleGraph.getValue());
    }

    public setHitType(hitType: eNoteHitGood)
    {

        const info = this.accuracyInfo.get(hitType);

        if(!info) return;

        this.setText(info.text);
        this.setColor(info.color);
    }

    public setText(str: string)
    {
        this.visibleTime = 1000;
        this.text.setText(str);
        this.scaleGraph.currentTime = 0;
    }

    public setColor(color: number)
    {
        const hexString = color.toString(16);

        console.log(hexString);

        this.text.setColor(`#${hexString}`);
    }

    public setComboText(str: string)
    {
        this.comboText.setText(str);
        this.scaleGraph.currentTime = 0;
    }
}