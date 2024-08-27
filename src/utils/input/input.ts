import { MainScene } from "../../game/scenes/mainScene";
import { BaseObject } from "../baseObject";
import { Debug } from "../debug/debug";

export class Input extends BaseObject
{
    public static Instance: Input;
    public static events = new Phaser.Events.EventEmitter();
    public static mousePosition = new Phaser.Math.Vector2();
    public static get pointerDown() { return this.Instance._pointersDown.length > 0; };
    public static previousPointerThatWentUp = 0;
    public static previousPointerThatWentDown = 0;

    public get scene() { return this._scene!; }
    public get input() { return this.scene.input; }

    private _scene?: Phaser.Scene;
    private _keysPressed: Map<string, boolean> = new Map<string, boolean>();
    private _pointersDown: number[] = [];

    constructor()
    {
        super();

        Input.Instance = this;
    }

    public init(scene: Phaser.Scene)
    {
        this._scene = scene;

        const input = scene.input;
        const keyboard = input.keyboard;

        if(!keyboard)
        {
            throw "Keyboard is null!";
        }

        keyboard.on('keydown', (event: KeyboardEvent) => {
            this.onKeyPress(event.key);
        });

        keyboard.on('keyup', (event: KeyboardEvent) => {
            this.onKeyUp(event.key);
        });
        
        input.on('pointerdown', (pointer: PointerEvent) => {

            /*
            const sound = scene.game.sound;

            if(sound instanceof Phaser.Sound.WebAudioSoundManager) {
                if(sound.context.state == 'suspended') {
                    sound.context.resume()
                }
            }
            */

            this.updateMousePosition(pointer)
            this.onPointerDown(pointer);
        });

        input.on('pointerup', (pointer: PointerEvent) => {
            this.updateMousePosition(pointer)
            this.onPointerUp(pointer);
        });

        input.on('pointermove', (pointer: PointerEvent) => {
            this.updateMousePosition(pointer)
        });
    }

    public updateMousePosition(pointer: PointerEvent)
    {
        Input.mousePosition.x = pointer.x;
        Input.mousePosition.y = pointer.y;
    }

    private onKeyPress(key: string)
    {
        key = key.toUpperCase();

        //Debug.log("Input", `key press: ${key}`);

        this._keysPressed.set(key, true);
    }

    private onKeyUp(key: string)
    {
        key = key.toUpperCase();
        
        //Debug.log("Input", `key up: ${key}`);

        this._keysPressed.set(key, false);
    }

    private onPointerDown(pointer: PointerEvent)
    {
        console.log("Pointer down", pointer);

        const activePointers = this.getActivePointers();
        for(const pointerId of activePointers)
        {
            if(!this._pointersDown.includes(pointerId))
            {
                this._pointersDown.push(pointerId);
                
                Input.previousPointerThatWentDown = pointerId;
            }
        }
        
        console.log(`${Input.previousPointerThatWentDown} is down`);
        Input.events.emit('pointerdown', pointer, Input.previousPointerThatWentDown);
    }

    private getActivePointers()
    {
        let activePointers: number[] = [];
        if(this.input.activePointer.isDown || this.input.pointer1?.isDown) activePointers.push(1);
        if(this.input.pointer2?.isDown) activePointers.push(2);

        return activePointers;
    }

    private onPointerUp(pointer: PointerEvent)
    {
        console.log("Pointer up", pointer);
        
        const activePointers = this.getActivePointers();
        for(const pointerId of this._pointersDown)
        {
            if(!activePointers.includes(pointerId))
            {
                this._pointersDown.splice(this._pointersDown.indexOf(pointerId), 1);
                Input.previousPointerThatWentUp = pointerId;
            }
        }
        
        
        console.log(`${Input.previousPointerThatWentUp} is up`);
        if(activePointers.length == 0) console.log("pointers are no longer down");
        Input.events.emit('pointerup', pointer, Input.previousPointerThatWentUp);
    }

    public static isPointInsideRect(pos: Phaser.Math.Vector2, rectPos: Phaser.Math.Vector2, rectSize: Phaser.Math.Vector2)
    {
        if (pos.x >= rectPos.x && pos.x <= rectPos.x + rectSize.x)
        {
            if (pos.y >= rectPos.y && pos.y <= rectPos.y + rectSize.y)
            {
                return true;
            }
        }
    
        return false;
    }
}