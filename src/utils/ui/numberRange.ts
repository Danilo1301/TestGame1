import { Button } from "./button";


export class NumberRange
{
    public container: Phaser.GameObjects.Container;
    public text: Phaser.GameObjects.Text;

    private _displaySize: number = 150;

    public value: number = 2;
    public addBy: number = 0.1;

    public leftButton: Button;
    public rightButton: Button;

    public onValueChange?: Function;

    constructor(scene: Phaser.Scene, displaySize: number)
    {
        this._displaySize = displaySize;

        this.container = scene.add.container(0, 0);

        const background = scene.add.rectangle(0, 0, displaySize, 30, 0xffffff);
        this.container.add(background);

        const leftButton = new Button(scene, "<", -this._displaySize/2, 0, 30, 30, "button");
        this.leftButton = leftButton;
        leftButton.onClick = () => {
            
        };
        this.container.add(leftButton.container);

        const rightButton = new Button(scene, ">", this._displaySize/2, 0, 30, 30, "button");
        this.rightButton = rightButton;
        rightButton.onClick = () => {
            
        };
        this.container.add(rightButton.container);

        this.text = scene.add.text(0, 0, "OPTIONS_DISPLAY", { font: '16px Arial', color: '#000000' });
        this.text.setOrigin(0.5);
        this.container.add(this.text);
    }

    public update()
    {
        const prevValue = this.value;

        if(this.leftButton.isPointerDown)
        {
            this.value -= this.addBy;
        }
        if(this.rightButton.isPointerDown)
        {
            this.value += this.addBy;
        }

        if(this.value != prevValue)
        {
            this.onValueChange?.();
        }

        this.text.setText(`${this.value.toFixed(2)}`);
    }
}