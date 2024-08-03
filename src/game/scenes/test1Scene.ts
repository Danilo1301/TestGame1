import { Debug } from "../../utils/debug/debug";
import Three from "../../utils/three/three";

//test
import * as THREE from 'three';

export class Test1Scene extends Phaser.Scene
{
    public canvas?: Phaser.Textures.CanvasTexture;

    public text?: Phaser.GameObjects.Text;

    constructor()
    {
        super({});
    }

    public async create()
    {
        Debug.log("create scene");

        const textureManager = this.textures;
        
        const gameSize = new Phaser.Math.Vector2(this.scale.width, this.scale.height);

        const canvasKey = "test_canvas";
        const canvas = textureManager.createCanvas(canvasKey, gameSize.x, gameSize.y);
        this.canvas = canvas;

        

        const image = this.add.image(0, 0, canvasKey);
        image.setPosition(gameSize.x/2, gameSize.y/2);
        //image.setOrigin(0, 0);
        //image.setScale(0.5);

        const text = this.add.text(0, 0, 'Test', { font: '16px Arial' });
        this.text = text;
    }

    public update(time: number, delta: number)
    {
        Three.animate();

        console.log(Three.getDomElementSize());

        const gameSize = new Phaser.Math.Vector2(this.scale.width, this.scale.height);

        const canvas = this.canvas!;

        canvas.clear();
        //canvas.context.fillStyle = "green";
        //canvas.context.fillRect(0, 0, Three.size.x, Three.size.y);
        canvas.context.drawImage(Three.renderer.domElement, 0, 0, gameSize.x, gameSize.y);
        canvas.refresh();

        const screenPosition = Three.convert3DPositionTo2D(Three.mesh.position);

        const text = this.text!;
        text.setText(`Screen Position: (${screenPosition.x}, ${screenPosition.y})`);
        text.setPosition(screenPosition.x, screenPosition.y);
    }
}