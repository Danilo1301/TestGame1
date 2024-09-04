import { BaseObject } from "../../../utils/baseObject";
import { Graph } from "../../../utils/graph";
import { getIsMobile } from "../../constants/config";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";
import { eNoteHitGood } from "../../notes/note";
import { GameScene } from "./gameScene";

/*
* it's not beeing used
*/

export class GameProgressBar extends BaseObject
{
    public container!: Phaser.GameObjects.Container;
    public graphics!: Phaser.GameObjects.Graphics;
    public progressText!: Phaser.GameObjects.Text;

    constructor()
    {
        super();

    }

    public create(scene: Phaser.Scene)
    {
        const gameSize = Gameface.Instance.getGameSize();

        const container = scene.add.container(0, 0);

        if(getIsMobile())
        {
            container.setPosition(110, 150)
        } else {
            container.setPosition(150, gameSize.y - 250);
        }

        Hud.addToHudLayer(container);

        const bg = scene.add.image(0, 0, "progress_bg");
        container.add(bg);

        const graphics = scene.add.graphics();
        graphics.setAngle(-90);
        this.graphics = graphics;
        container.add(graphics);

        //progress text
        const progressText = scene.add.text(0, 0, '100%').setFontFamily('Arial');
        progressText.setFontSize(28);
        progressText.setColor('#FFFFFF');
        progressText.setOrigin(0.5);
        progressText.setStroke('#000000', 4);
        progressText.setPosition(0, 0);
        container.add(progressText);
        this.progressText = progressText;
    }

    public update(delta: number)
    {
        let maxTime = 1;
        let time = 0;

        if(GameScene.Instance.soundPlayer.isRunning())
        {
            maxTime = GameScene.Instance.soundPlayer.getFinishTime();
            time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        }
        
        let progress = time / maxTime;
        if(progress > 1) progress = 1;

        const graphics = this.graphics;        
        graphics.clear();

        const startAngle = 0;
        const endAngle = progress * 360;
        const radius = 80;

        const drawBlack = true;
        if(drawBlack)
        {
            graphics.lineStyle(25, 0x000000)
            graphics.beginPath();
            graphics.arc(0, 0, radius, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false);
            graphics.strokePath(); // Para desenhar a linha do arco
            graphics.closePath();
        }

        graphics.lineStyle(20, 0x00ff00)
        graphics.beginPath();
        graphics.arc(0, 0, radius, Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), false);
        graphics.strokePath(); // Para desenhar a linha do arco
        graphics.closePath();

        //progressText
        const progressText = this.progressText;
        progressText.setText(`${(progress*100).toFixed(0)}%`);
    }
}