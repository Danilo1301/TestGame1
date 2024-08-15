import { BaseObject } from "../../../utils/baseObject";
import { Graph } from "../../../utils/graph";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";
import { eNoteHitGood } from "../../notes/note";

export class HitAccuracy extends BaseObject
{
    public text!: Phaser.GameObjects.Text;
    public comboText!: Phaser.GameObjects.Text;
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

        const text = scene.add.text(gameSize.x / 2, 100, 'HIT_ACCURACY').setFontFamily('Arial');
        this.text = text;
        Hud.addToHudLayer(text);
        
        text.setFontSize(40);
        text.setColor('#ffffff');
        text.setOrigin(0.5);
        text.setStroke('#000000', 8);

        const comboText = scene.add.text(gameSize.x / 2, 150, '100').setFontFamily('Arial');
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
        const names = new Map<eNoteHitGood, string>();
        names.set(eNoteHitGood.HIT_PERFECT, "PERFECT");
        names.set(eNoteHitGood.HIT_GOOD, "GOOD");
        names.set(eNoteHitGood.HIT_OK, "OK");
        names.set(eNoteHitGood.HIT_BAD, "BAD");
        names.set(eNoteHitGood.HIT_NOT_ON_TIME, "WTF");

        const str = names.get(hitType);

        if(!str) return;

        this.setText(str);
    }

    public setText(str: string)
    {
        this.visibleTime = 1000;
        this.text.setText(str);
        this.scaleGraph.currentTime = 0;
    }

    public setComboText(str: string)
    {
        this.comboText.setText(str);
        this.scaleGraph.currentTime = 0;
    }
}