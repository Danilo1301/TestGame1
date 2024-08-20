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
    }

    public update()
    {
        const hittedNotes = GameScene.Instance.notes.getNotesHitted().length;
        const missedNotes = GameScene.Instance.notes.getNotesMissed().length;

        this.player.data.hits = hittedNotes;
        this.player.data.misses = missedNotes;
        this.player.data.combo = GameScene.Instance.combo;
        this.player.data.name = "My username";
        this.player.data.score = GameScene.Instance.score;
        this.player.moneyText.setText(`R$ ${GameScene.Instance.money.toFixed(2)}`);

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

    public createSecondUser()
    {
        const secondPlayer = this.createUser();

        secondPlayer.data.name = "Opponent";
        secondPlayer.container.setPosition(-100, 350);

        return secondPlayer;
    }
}