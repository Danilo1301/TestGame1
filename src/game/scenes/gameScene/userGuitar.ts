import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { BaseObject } from "../../../utils/baseObject";
import { ProgressBar } from "../../../utils/ui/progressBar";
import { GameScene } from "./gameScene";
import { MoneyText } from "./moneyText";

/*
this is not beeing used anymore
*/

export interface UserGuitarData {
    name: string
    hits: number
    misses: number
    combo: number
    score: number
}

export class UserGuitar extends BaseObject
{
    public container: Phaser.GameObjects.Container;

    public data: UserGuitarData = {
        name: "USERNAME",
        hits: 1,
        misses: 2,
        combo: 100,
        score: 69420
    };

    public showMoney: boolean = false;

    public progressBar: ProgressBar;
    public nameText: Phaser.GameObjects.Text;
    public comboText: Phaser.GameObjects.Text;
    public accuracyText: Phaser.GameObjects.Text;
    public moneyText: MoneyText;

    constructor(scene: Phaser.Scene)
    {
        super();

        const container = scene.add.container();
        this.container = container;

        //guitar slot container
        const guitarSlotContainer = scene.add.container();
        container.add(guitarSlotContainer);
        guitarSlotContainer.setPosition(0, 0);

        //guitar slot
        const slotSize = 150;

        const guitarSlot = scene.add.image(0, 0, "guitar_slot");
        const s = slotSize/guitarSlot.width
        guitarSlot.setScale(s);
        guitarSlotContainer.add(guitarSlot);
        
        //guitar icon
        const guitarIcon = scene.add.image(0, 0, "guitar_icon1");
        guitarIcon.setOrigin(0, 1);
        guitarIcon.setPosition(-slotSize/2, slotSize/2);
        guitarSlotContainer.add(guitarIcon);

        let y = -50;

        //combo
        const name = scene.add.text(0, 0, 'USERNAME').setFontFamily('Arial');
        name.setFontSize(20);
        name.setColor('#FFFFFF');
        name.setOrigin(1, 0.5);
        name.setStroke('#000000', 4);
        name.setPosition(-80, y);
        container.add(name);
        this.nameText = name;

        y += 30;

        //combo
        const combo = scene.add.text(0, 0, 'x123').setFontFamily('Arial');
        combo.setFontSize(28);
        combo.setColor('#FFFFFF');
        combo.setOrigin(1, 0.5);
        combo.setStroke('#000000', 4);
        combo.setPosition(-80, y);
        container.add(combo);
        this.comboText = combo;

        y += 30;

        //accuracy
        const accuracy = scene.add.text(0, 0, 'Acertos: 80%').setFontFamily('Arial');
        accuracy.setFontSize(20);
        accuracy.setColor('#FFFFFF');
        accuracy.setOrigin(1, 0.5);
        accuracy.setStroke('#000000', 4);
        accuracy.setPosition(-80, y);
        container.add(accuracy);
        this.accuracyText = accuracy;

        y += 30;

        //progressBar
        const progressBar = new ProgressBar(scene, 200, 20);
        container.add(progressBar.container);
        progressBar.container.setPosition(-180, y)
        progressBar.setProgressColor(0xff0000);
        progressBar.setRestColor(0x00ff00);
        this.progressBar = progressBar;
        
        y += 30;

        //money
        const moneyText = new MoneyText(scene);
        moneyText.container.setPosition(70, 110);
        container.add(moneyText.container);
        this.moneyText = moneyText;

        window.game.moneyText = moneyText;
    }

    public update(delta: number)
    {
        this.nameText.setText(this.data.name);

        //

        const hittedNotes = this.data.hits;
        const missedNotes = this.data.misses;
        const totalNotes = hittedNotes + missedNotes;

        const ratio = missedNotes / totalNotes;

        this.progressBar.setProgress(ratio);

        //

        let accRatio = hittedNotes / totalNotes;
        if(Number.isNaN(accRatio)) accRatio = 1;

        this.accuracyText.setText(`Acertos: ${(accRatio*100).toFixed(0)}%`);

        //

        this.comboText.setText(`${this.data.score} | x${this.data.combo}`);

        //

        this.moneyText.update(delta);
        this.moneyText.container.setVisible(this.showMoney);
    }
}