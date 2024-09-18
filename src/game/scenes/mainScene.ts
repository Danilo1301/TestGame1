import { AudioManager } from "../../utils/audioManager/audioManager";
import { Button } from "../../utils/ui/button";
import { Options } from "../../utils/ui/options";
import { getIsMobile } from "../../utils/utils";
import { gameSettings } from "../constants/gameSettings";
import { Gameface } from "../gameface/gameface";
import { Hud } from "../hud/hud";

export class MainScene extends Phaser.Scene
{
    public static Instance: MainScene;
    
    public layerBackground!: Phaser.GameObjects.Layer;
    public layerNormal!: Phaser.GameObjects.Layer;
    public layerGround!: Phaser.GameObjects.Layer;
    public layerNotes!: Phaser.GameObjects.Layer;
    public layerHud!: Phaser.GameObjects.Layer;

    public fpsText!: Phaser.GameObjects.Text;
    public testText!: Phaser.GameObjects.Text;

    public loadBackground?: Phaser.GameObjects.Image;
    public howToPlayImage?: Phaser.GameObjects.Image;

    public onStart?: Function;

    constructor()
    {
        super({});

        MainScene.Instance = this;
    }

    public async create()
    {
        this.layerNormal = this.add.layer();
        this.layerNormal.setDepth(0);

        this.layerGround = this.add.layer();
        this.layerGround.setDepth(100);

        this.layerNotes = this.add.layer();
        this.layerNotes.setDepth(1000);

        this.layerBackground = this.add.layer();
        this.layerBackground.setDepth(5000);

        this.layerHud = this.add.layer();
        this.layerHud.setDepth(10000);

        this.fpsText = this.add.text(5, 5, '0 FPS').setFontFamily('Arial');
        this.fpsText.setFontSize(20);
        this.fpsText.setColor('#00ff00');
        this.fpsText.setOrigin(0);
        this.fpsText.setStroke('#000000', 4);
        this.layerHud.add(this.fpsText);
        this.fpsText.setVisible(gameSettings.showFPS);

        this.testText = this.add.text(5, 30, 'TEST').setFontFamily('Arial');
        this.testText.setFontSize(20);
        this.testText.setColor('#00ff00');
        this.testText.setOrigin(0);
        this.testText.setStroke('#000000', 4);
        this.testText.setVisible(false); //visible false

        const fullscreenButtonY = getIsMobile() ? 300 : 120;

        const button = Hud.addButton("Fullscreen", 30, fullscreenButtonY, 50, 50, "button");
        button.onClick = () => {
            Gameface.Instance.toggleFullscreen();
        };
        Hud.addToHudLayer(button.container);

        button.container.setVisible(false);

        const gameSize = Gameface.Instance.getGameSize();
        
        const image = this.add.image(gameSize.x/2, gameSize.y/2, "background_load");
        this.loadBackground = image;
        if(getIsMobile())
        {
            image.setScale(1.5);
        }

        const howToPlay = this.add.image(gameSize.x/2, gameSize.y/2, "how_to_play");
        this.howToPlayImage = howToPlay;
        
        if(getIsMobile())
        {
            howToPlay.setScale(0.8);
        } else {
            howToPlay.setScale(0.6);
        }
    }

    public toggleShowFPS()
    {
        gameSettings.showFPS = !gameSettings.showFPS;
        this.setFPSVisible(gameSettings.showFPS);
    }

    public setFPSVisible(visible: boolean)
    {
        this.fpsText.setVisible(visible);
    }

    public update(time: number, delta: number)
    {
        if(gameSettings.showFPS)
            this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} FPS`);

        /*
        this.testText.setText([
            'activePointer.isDown: ' + this.input.activePointer?.isDown,
            'pointer1.isDown: ' + this.input.pointer1?.isDown,
            'pointer2.isDown: ' + this.input.pointer2?.isDown,
            'pointer3.isDown: ' + this.input.pointer3?.isDown,
            'pointer4.isDown: ' + this.input.pointer4?.isDown
        ]);
        */
    }

    public createPlayButton()
    {
        const gameSize = Gameface.Instance.getGameSize();
        const button = new Button(this, "", gameSize.x/2, gameSize.y - 200, 450, 70, "play_button");
        if(!getIsMobile())
        {
            button.container.setPosition(button.container.x, gameSize.y - 50)
        }
        button.onClick = () => {  
            button.destroy();
            this.loadBackground?.destroy();
            this.loadBackground = undefined;
            this.howToPlayImage?.destroy();
            this.howToPlayImage = undefined;
            this.onStart?.();
        };
    }
}