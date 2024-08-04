import { Debug } from "../../utils/debug/debug";
import Mesh from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { Gameface } from "../gameface/gameface";
import { Notes } from "../notes/notes";
import { Pads } from "../pads/pads";

export class MainScene extends Phaser.Scene
{
    public static Instance: MainScene;
    
    public layerNormal!: Phaser.GameObjects.Layer;
    public layerHud!: Phaser.GameObjects.Layer;

    public firstClickText?: Phaser.GameObjects.Text;

    public fpsText!: Phaser.GameObjects.Text;

    constructor()
    {
        super({});

        MainScene.Instance = this;
    }

    public async create()
    {
        this.layerNormal = this.add.layer();
        this.layerNormal.setDepth(0);

        this.layerHud = this.add.layer();
        this.layerHud.setDepth(10000);

        this.fpsText = this.add.text(10, 10, "0 FPS", { font: '16px Arial' });

        this.firstClickText = this.add.text(200, 200, 'Click anywhere to start', { font: '16px Arial' });
    }

    public update(time: number, delta: number)
    {
        this.fpsText.setText(`${this.game.loop.actualFps} FPS`);
    }
}