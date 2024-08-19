import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { BaseObject } from "../../../utils/baseObject";
import { ProgressBar } from "../../../utils/ui/progressBar";
import { GameScene } from "./gameScene";

export interface UserGuitarData {
    hits: number
    misses: number
    combo: number
}

export class UserGuitar extends BaseObject
{
    public container: Phaser.GameObjects.Container;

    public data: UserGuitarData = {
        hits: 1,
        misses: 2,
        combo: 100
    };

    public showMoney: boolean = false;

    public progressBar: ProgressBar;
    public accuracyText: Phaser.GameObjects.Text;
    public comboText: Phaser.GameObjects.Text;
    public moneyText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene)
    {
        super();

        const container = scene.add.container();
        this.container = container;

        const rect = scene.add.rectangle(0, 0, 20, 20, 0xff0000);
        container.add(rect);

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

        //progressBar
        const progressBar = new ProgressBar(scene, 200, 20);
        container.add(progressBar.container);
        progressBar.container.setPosition(-180, 20)
        progressBar.setProgressColor(0xff0000);
        progressBar.setRestColor(0x00ff00);
        this.progressBar = progressBar;

        //accuracy
        const accuracy = scene.add.text(0, 0, 'Acertos: 80%').setFontFamily('Arial');
        accuracy.setFontSize(28);
        accuracy.setColor('#FFFFFF');
        accuracy.setOrigin(0.5);
        accuracy.setStroke('#000000', 4);
        accuracy.setPosition(-180, -10);
        container.add(accuracy);
        this.accuracyText = accuracy;

        //combo
        const combo = scene.add.text(0, 0, 'x123').setFontFamily('Arial');
        combo.setFontSize(28);
        combo.setColor('#FFFFFF');
        combo.setOrigin(0.5);
        combo.setStroke('#000000', 4);
        combo.setPosition(-180, -50);
        container.add(combo);
        this.comboText = combo;
        
        //money
        const money = scene.add.text(0, 0, 'R$ 245,12').setFontFamily('Arial');
        money.setFontSize(28);
        money.setColor('#00FF00');
        money.setOrigin(0.5);
        money.setStroke('#000000', 4);
        money.setPosition(-180, 50);
        container.add(money);
        this.moneyText = money;

        (window as any)["progressBar"] = progressBar;
        (window as any)["accuracy"] = accuracy;
        (window as any)["combo"] = combo;
        (window as any)["money"] = money;
    }

    public update()
    {
        const hittedNotes = this.data.hits;
        const missedNotes = this.data.misses;
        const totalNotes = hittedNotes + missedNotes;

        const ratio = missedNotes / totalNotes;

        this.progressBar.setProgress(ratio);

        //

        let accRatio = hittedNotes / totalNotes;
        if(Number.isNaN(accRatio)) accRatio = 1;

        this.accuracyText.setText(`Acertos: ${(accRatio*100).toFixed(0)}%`);

        this.comboText.setText(`x${this.data.combo}`);

        //

        this.moneyText.setVisible(this.showMoney);
    }
}