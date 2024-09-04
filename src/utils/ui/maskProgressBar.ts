import { Button } from "./button";

/*
* So, there is a stupid bug that when we add the shape to the cointainer, the background goes to 0, 0
* To fix it, the shape must be separated and follow the container position
*/

export class MaskProgressBar
{
    public container: Phaser.GameObjects.Container;
    public shape: Phaser.GameObjects.Image;

    public maskOffsetX: number = 25; // offset of the part that is usually round in the mask
    
    //public mask: Phaser.GameObjects.Image;
    
    private _vertical: boolean;
    private _progress: number = 1.0;
    private _width: number;

    constructor(scene: Phaser.Scene, width: number, height: number, texture: string, vertical: boolean = false)
    {
        this._width = width;
        this._vertical = vertical

        const container = scene.add.container(0, 0);
        this.container = container;

        const margin = 3;

        const background = scene.add.image(0, 0, texture);
        background.setDisplaySize(width, height);
        container.add(background);

        const shape = scene.add.image(0, 0, "progress_bar_mask").setVisible(false);
        shape.setAlpha(1);
        shape.setDisplaySize(width, height);
        
        //container.add(shape);  // cant add shape to container
        this.shape = shape;

        var mask = scene.add.bitmapMask(shape);

        background.setMask(mask);

        if(vertical)
        {
            background.setAngle(-90);
            shape.setAngle(-90);
        }
    }

    public setProgress(progress: number)
    {
        this._progress = progress
    }

    public update()
    {
        const mat = this.container.getWorldTransformMatrix();
        const position = new Phaser.Math.Vector2(mat.getX(0, 0), mat.getY(0, 0));

        if(!this._vertical)
        {
            position.x -= this._width;
            position.x += this._progress * this._width;
        } else {
            position.y += this._width;
            position.y -= this._progress * this._width;
        }

        this.shape.setPosition(position.x, position.y);

        //this.mask.setPosition(this._progress * this._width - this.maskOffsetX, 0);
    }
}