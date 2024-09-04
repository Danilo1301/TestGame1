import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { BaseObject } from "../../../utils/baseObject";
import { ProgressBar } from "../../../utils/ui/progressBar";
import { GameScene } from "./gameScene";
import { UserGuitar } from "./userGuitar";
import { MainScene } from "../mainScene";
import { Hud } from "../../hud/hud";
import { Gameface } from "../../gameface/gameface";
import { MoneyText } from "./moneyText";
import { MaskProgressBar } from "../../../utils/ui/maskProgressBar";
import { getIsMobile } from "../../constants/config";
import { clamp, msToMinutes, msToTime } from "../../../utils/utils";

export class GuitarHud extends BaseObject
{
    public moneyText!: MoneyText;
    public songDurationText!: Phaser.GameObjects.Text;

    public songProgressBar!: MaskProgressBar;
    public accProgressBar!: MaskProgressBar;
    

    //public userGuitars: UserGuitar[] = [];

    public create()
    {
        const scene = MainScene.Instance;

        const gameSize = Gameface.Instance.getGameSize();
        const margin = 15;

        const container = scene.add.container();
        Hud.addToHudLayer(container);

        const image = scene.add.image(-margin, margin, "hud/bg1");
        image.setOrigin(1, 0);
        image.setScale(0.7);
        container.add(image);

        const image2 = scene.add.image(-margin, 220, "hud/bg2");
        image2.setOrigin(1, 0);
        image2.setScale(0.8);
        container.add(image2);

        const image3 = scene.add.image(-57, 258, "hud/money");
        image3.setOrigin(0.5);
        image3.setScale(0.15);
        container.add(image3);

        const image4 = scene.add.image(-64, 190, "guitars/guitar1");
        image4.setOrigin(0.5, 1);
        image4.setScale(0.13);
        container.add(image4);

        //money
        const moneyText = new MoneyText(scene);
        moneyText.container.setPosition(-110, 265);
        container.add(moneyText.container);
        this.moneyText = moneyText;

        //song image

        const songImage = scene.add.image(-410, 110, "song1_image");
        songImage.setDisplaySize(110, 110);
        container.add(songImage);
        //this.songImage = songImage;

        //

        const songTitleText = scene.add.text(-340, 70, 'Song Title');
        songTitleText.setFontFamily('Arial');
        songTitleText.setFontStyle("bold");
        songTitleText.setFontSize(24);
        songTitleText.setColor("#ffffff");
        songTitleText.setOrigin(0, 0.5);
        songTitleText.setStroke('#000000', 4);
        container.add(songTitleText);

        const songAuthor = scene.add.text(-340, 70 + 30, 'Author name');
        songAuthor.setFontFamily('Arial');
        songAuthor.setFontStyle("bold");
        songAuthor.setFontSize(18);
        songAuthor.setColor("#ffffff");
        songAuthor.setOrigin(0, 0.5);
        songAuthor.setStroke('#000000', 4);
        container.add(songAuthor);

        //

        container.setPosition(gameSize.x, 0);
        
        const accBg2 = scene.add.image(-240, 150, "progress_bar_bg2");
        accBg2.setDisplaySize(200 + 4, 10 + 4);
        container.add(accBg2);

        const songProgressBar = new MaskProgressBar(scene, 200, 10, "progress_bar2");
        songProgressBar.container.setPosition(-240, 150);
        container.add(songProgressBar.container);
        this.songProgressBar = songProgressBar;

        const songDuration = scene.add.text(-144, 127, '0:00 / 0:00');
        songDuration.setFontFamily('Arial');
        songDuration.setFontStyle("bold");
        songDuration.setFontSize(14);
        songDuration.setColor("#ffffff");
        songDuration.setOrigin(1, 0.5);
        songDuration.setStroke('#000000', 4);
        container.add(songDuration);
        this.songDurationText = songDuration;

        //acc

        const accPosition = new Phaser.Math.Vector2(
            50,
            gameSize.y/2
        );
        let accSize = gameSize.y - 100;
        if(getIsMobile())
        {
            accPosition.set(50, gameSize.y/2 - 250);
            accSize -= 450;
        }

        const accBg = scene.add.image(accPosition.x, accPosition.y, "progress_bar_bg");
        accBg.setAngle(-90);
        accBg.setDisplaySize(accSize + 4, 30 + 4);
        Hud.addToHudLayer(accBg);
        
        const accProgressBar = new MaskProgressBar(scene, accSize, 30, "progress_bar", true);
        accProgressBar.container.setPosition(accPosition.x, accPosition.y);
        Hud.addToHudLayer(accProgressBar.container);
        this.accProgressBar = accProgressBar;

        //

        window.game.moneyText = moneyText;
        window.game.image = image;
        window.game.songProgressBar = songProgressBar;
        window.game.accProgressBar = accProgressBar;

        /*
        const player = this.createUser();
        this.player = player;
        this.player.showMoney = true;

        player.container.setPosition(-100, 100);
        */
    }

    public update(delta: number)
    {
        // -------

        let maxTime = 1;
        let time = 0;

        if(GameScene.Instance.soundPlayer.isRunning())
        {
            maxTime = GameScene.Instance.soundPlayer.getFinishTime();
            time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        }
        
        let progress = time / maxTime;
        if(progress > 1) progress = 1;

        this.songProgressBar.setProgress(progress);
        this.songProgressBar.update();

        // -------

        const hittedNotes = GameScene.Instance.notes.getNotesHitted().length;
        const missedNotes = GameScene.Instance.notes.getNotesMissed().length;

        const totalNotes = hittedNotes + missedNotes;

        let hitRatio = clamp(missedNotes / totalNotes, 0, 1);
        if(Number.isNaN(hitRatio)) hitRatio = 0;

        this.accProgressBar.setProgress(1 - hitRatio);

        // -------

        this.accProgressBar.update();

        const accumulatedMoney = GameScene.Instance.accumulatedMoney;
        const money = GameScene.Instance.money;

        this.moneyText.text.setText(`R$ ${money.toFixed(2)}`);
        this.moneyText.accumulatedMoneyText.setText(`+ R$ ${accumulatedMoney.toFixed(2)}`);
        this.moneyText.update(delta);

        // --------

     
        this.songDurationText.setText(msToMinutes(time) + " / " + msToMinutes(maxTime));
    }

    /*
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
    */
}