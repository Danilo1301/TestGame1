import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { BaseObject } from "../../../utils/baseObject";
import { ProgressBar } from "../../../utils/ui/progressBar";
import { GameScene } from "./gameScene";
import { UserGuitar } from "./userGuitar";

export class GuitarHud extends BaseObject
{
    public hitProgressBar!: ProgressBar;

    public guitarSlotContainer!: Phaser.GameObjects.Container;
    public accuracyText!: Phaser.GameObjects.Text;

    public player!: UserGuitar;

    public userGuitars: UserGuitar[] = [];

    public create()
    {
        const player = this.createUser();
        this.player = player;
        this.player.showMoney = true;

        player.container.setPosition(-100, 100);

        const secondPlayer = this.createUser();

        secondPlayer.container.setPosition(-100, 400);

        /*
        return;

        //progress
        const progress = new ProgressBar(scene, 200, 20);
        this.hitProgressBar = progress;
        container.add(progress.container);
        progress.container.setPosition(-280, 200);
        progress.setProgressColor(0xff0000);
        progress.setRestColor(0x00ff00);

        //guitar slot container
        const guitarSlotContainer = scene.add.container();
        container.add(guitarSlotContainer);
        guitarSlotContainer.setPosition(-100, 150);

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

        //money
        const money = scene.add.text(0, 0, 'R$ 245,12').setFontFamily('Arial');
        money.setFontSize(28);
        money.setColor('#00FF00');
        money.setOrigin(0.5);
        money.setStroke('#000000', 4);
        money.setPosition(-280, 100);
        container.add(money);

        //accuracy
        const accuracy = scene.add.text(0, 0, 'Acertos: 80%').setFontFamily('Arial');
        accuracy.setFontSize(28);
        accuracy.setColor('#FFFFFF');
        accuracy.setOrigin(0.5);
        accuracy.setStroke('#000000', 4);
        accuracy.setPosition(-280, 150);
        container.add(accuracy);
        this.accuracyText = accuracy;

        (window as any)["guitarSlot"] = guitarSlot;
        (window as any)["accuracy"] = accuracy;
        (window as any)["money"] = money;
        */
    }

    public update()
    {
        const hittedNotes = GameScene.Instance.notes.getNotesHitted().length;
        const missedNotes = GameScene.Instance.notes.getNotesMissed().length;

        this.player.data.hits = hittedNotes;
        this.player.data.misses = missedNotes;
        this.player.data.combo = GameScene.Instance.combo;

        for(const userGuitar of this.userGuitars)
        {
            userGuitar.update();
        }
    }

    public createUser()
    {
        const userGuitar = new UserGuitar(GameScene.Instance);
        GameScene.Instance.topRightContainer.add(userGuitar.container);

        this.userGuitars.push(userGuitar);

        return userGuitar;
    }
}