import { BaseObject } from "../../../utils/baseObject";
import { Graph } from "../../../utils/graph";
import { randomIntFromInterval } from "../../../utils/utils";
import { gameSettings, getIsMobile } from "../../constants/config";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";

export enum InfoTextPanelColor {
    PANEL_RED,
    PANEL_GREEN
}

export class InfoText extends BaseObject
{
    public container!: Phaser.GameObjects.Container;
    public textContainer!: Phaser.GameObjects.Container;
    public background!: Phaser.GameObjects.Image;
    public text!: Phaser.GameObjects.Text;
    public scaleGraph: Graph = new Graph();
    public visibleTime: number = 0;

    public missTexts: string[] = [
        "Quase lá!\nSó mais uma tentativa!",
        "Relaxa, a próxima você\nacerta e vira o jogo!",
        "Errou? Nada que uma\nsegunda chance não resolva!",
        "Sacode a poeira e tenta\nde novo, você consegue!",
        "Não desiste,\na vitória tá logo ali!"
    ];

    public hitTexts: string[] = [
        "Uau! Continua assim que\no show só tá começando!",
        "Tá mandando bem!\nBora pro próximo nível?",
        "Arrasou! Mais " + gameSettings.comboAward + " e\nvocê vira lenda!",
        "Você tá pegando o jeito!\nQuer ver até onde vai?",
        "Tá brilhando! Continua que\no sucesso é garantido!"
    ];

    constructor()
    {
        super();

        this.scaleGraph.add(0.5, 100);
        this.scaleGraph.add(1.3, 100);
        this.scaleGraph.add(1.0, 0);

        window.game.infoText = this;
    }

    public create(scene: Phaser.Scene)
    {
        const gameSize = Gameface.Instance.getGameSize();

        const containerY = getIsMobile() ? 300 : 260;

        const container = scene.add.container(gameSize.x / 2, gameSize.y / 2 - containerY);
        Hud.addToHudLayer(container);
        this.container = container;

        //const background = scene.add.nineslice(0, 0, 20, 20, "blue_panel", 20);
        const background = scene.add.image(0, 0, "grey_panel2");
        background.setOrigin(0.5);
        container.add(background);
        this.background = background;

        //const background = scene.add.image(0, 0, "blue_panel");
        //container.add(background);
        //this.background = background;

        const textContainer = scene.add.container();
        container.add(textContainer);
        this.textContainer = textContainer;

        const fontSize = getIsMobile() ? 40 : 30;

        const text = scene.add.text(0, 0, 'INFO_TEXT');
        text.setFontFamily('Arial');
        text.setFontSize(fontSize);
        text.setColor('#ffffff');
        text.setOrigin(0.5);
        text.setAlign("center");
        text.setStroke('#000000', 8);
        this.text = text;
        textContainer.add(text);

        window.game.infoText = this;
    }

    public setPanelColor(color: number)
    {
        this.background.setTint(color);
    }

    public update(delta: number)
    {
        this.scaleGraph.changeCurrentTimeBy(delta);

        if(this.visibleTime > 0)
        {
            this.visibleTime -= delta;
            if(this.visibleTime < 0) this.visibleTime = 0;
        }

        const textBounds = this.text.getBounds();

        let w = textBounds.width + 30;
        if(w < 300) w = 300;

        this.background.setDisplaySize(w, textBounds.height + 30);
        this.textContainer.setScale(this.scaleGraph.getValue());
        this.container.setVisible(this.visibleTime > 0 || this.visibleTime == -1);
    }

    public setText(str: string, time: number)
    {
        this.visibleTime = time;
        this.text.setText(str);
        this.scaleGraph.currentTime = 0;
    }

    public setWhiteText(str: string, time: number)
    {
        this.setPanelColor(0xffffff);
        this.setText(str, time);
    }

    public setGreenText(str: string, time: number)
    {
        this.setPanelColor(0x00B214);
        this.setText(str, time);
    }

    public setRedText(str: string, time: number)
    {
        this.setPanelColor(0xD84B4B);
        this.setText(str, time);
    }

    public setColor(color: number)
    {
        const hexString = color.toString(16);
        this.text.setColor(`#${hexString}`);
    }

    public showRandomHitMessage()
    {
        const message = this.hitTexts[randomIntFromInterval(0, this.hitTexts.length-1)];

        this.setGreenText(message, 1500);
    }

    public showRandomMissMessage()
    {
        const message = this.missTexts[randomIntFromInterval(0, this.missTexts.length-1)];

        this.setRedText(message, 1500);
    }
}