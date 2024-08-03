import { MainScene } from "../../game/scenes/mainScene";
import { BaseObject } from "../baseObject";
import { Debug } from "../debug/debug";

export class Input extends BaseObject
{
    public get scene() { return this._scene!; }

    private _scene?: Phaser.Scene;

    private _keysPressed: Map<string, boolean> = new Map<string, boolean>();

    public get sceneInput() { return this.scene.input; }

    public init(scene: Phaser.Scene)
    {
        this._scene = scene;

        scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            this.onKeyPress(event.key);
        });

        scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            this.onKeyUp(event.key);
        });
    }

    private onKeyPress(key: string)
    {
        key = key.toUpperCase();

        Debug.log("Input", `key press: ${key}`);

        this._keysPressed.set(key, true);
    }

    private onKeyUp(key: string)
    {
        key = key.toUpperCase();
        
        //Debug.log("Input", `key up: ${key}`);

        this._keysPressed.set(key, false);
    }
}