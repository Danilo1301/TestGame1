import { AudioManager } from "../../utils/audioManager/audioManager";
import { Button } from "../../utils/ui/button";
import { Options } from "../../utils/ui/options";
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

        const button = Hud.addButton("Fullscreen", 30, 120, 50, 50, "button");
        button.onClick = () => {
            Gameface.Instance.toggleFullscreen();
        };
        Hud.addToHudLayer(button.container);
    }

    public update(time: number, delta: number)
    {
        this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} FPS`);
    }

    public createPlayButton()
    {
        const gameSize = Gameface.Instance.getGameSize();
        const button = new Button(this, "Play", gameSize.x/2, gameSize.y/2, 200, 50, "button");
        button.onClick = () => {  
            button.destroy();
            this.onStart?.();
        };
    }
}