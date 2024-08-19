import { AudioManager } from "../../utils/audioManager/audioManager";
import { BaseObject } from "../../utils/baseObject";
import { Input } from "../../utils/input/input";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { eNoteHitGood, Note } from "../notes/note";
import { EditorScene } from "../scenes/editor/editorScene";
import { GameScene } from "../scenes/gameScene/gameScene";
import { MainScene } from "../scenes/mainScene";

export class Pad extends BaseObject
{
    public container!: Phaser.GameObjects.Container;
    public spriteColor?: Phaser.GameObjects.Sprite;

    public object: Phaser3DObject;
    public position: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    public draggingNote?: Note;
    public startedDragAtTime: number = 0;

    private _active: boolean = false;

    private _keyObject?: Phaser.Input.Keyboard.Key;

    public color: number = 0x0000ff;

    constructor(object: Phaser3DObject)
    {
        super();

        this.object = object;
        this.object.debugText.createDebugText();
        this.object.setInvisible();

        const scene = GameScene.Instance;
        
        this.container = scene.add.container(50, 50);
        MainScene.Instance.layerNotes.add(this.container);

        this.spriteColor = scene.add.sprite(0, 0, 'pad_sheet', 'pad_color2.png');    
        this.spriteColor.setScale(1.2);
        this.container.add(this.spriteColor);

        Input.events.on("pointerdown", (event: PointerEvent) => {
            //console.log("poniter down")

            const mousePosition = Input.mousePosition;
            const position = this.position;
            const distance = position.distance(mousePosition);

            //console.log(mousePosition, distance)

            if(distance < 50)
            {
                this.activatePad();
            }
        });

        Input.events.on("pointerup", (event: PointerEvent) => {
            this.deactivatePad();
        });
    }

    public activatePad()
    {
        this._active = true;
        
        this.spriteColor?.anims.play('pad_color_raise');    

        const note = GameScene.Instance.notes.getClosestNoteForPad(this.getIndex());
        
        console.log(note);
        
        if(note)
        {

            if(!note.hitted)
            {
                const notes = GameScene.Instance.notes;
            
                const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
                const noteTime = note.songNote.time;
                const distanceInMs = Math.abs(time - noteTime);

                const hitType = notes.getHowGoodNoteIs(distanceInMs);

                const countAsHit = hitType != eNoteHitGood.HIT_NOT_ON_TIME;

                if(countAsHit)
                {
                    AudioManager.playAudioPhaser("osu_hitsound");
                    
                    if(Gameface.Instance.sceneManager.hasSceneStarted(EditorScene)) return
                    
                    this.hitNote(note);

                    GameScene.Instance.hitCombo(note, hitType)
                } else {
                    //GameScene.Instance.breakCombo();
                }
            }
        }
    }

    public hitNote(note: Note)
    {
        note.setAsHitted();
        
        if(note.songNote.dragTime > 0)
        {
            note.startBeeingDragged(this);

            this.draggingNote = note;
            this.startedDragAtTime = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        }
    }

    public stopDrag()
    {
        const note = this.draggingNote;

        if(!note) return;
        
        const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();

        const end = note.songNote.time + note.songNote.dragTime;

        console.log(`start: ${note.songNote.time}`);
        console.log(`end: ${note.songNote.time + note.songNote.dragTime}`);
        console.log(`current: ${time}`);

        const distanceInMs = Math.abs(end - time);
        const distance = GameScene.Instance.notes.getDistanceFromMs(distanceInMs);

        console.log(`distance: ${distance} (${distanceInMs}ms)`)

        note.stopBeeingDragged();

        this.draggingNote = undefined;
        this.startedDragAtTime = 0;

        AudioManager.playAudioPhaser("osu_hitsound");
    }

    public deactivatePad()
    {
        if(!this._active) return;

        this._active = false;

        this.spriteColor?.anims.playReverse('pad_color_raise');

        this.stopDrag();
    }

    public getPosition()
    {
        return this.object.object.position;
    }

    public getIndex()
    {
        const index = GameScene.Instance.pads.pads.indexOf(this);
        return index;
    }

    public setKey(key: string)
    {
        const keyBoard = Gameface.Instance.input.sceneInput.keyboard;

        if(!keyBoard) throw "Keyboard is null";

        const keyObject = keyBoard.addKey(key);

        const pad = this;

        keyObject.on('down', function(event: KeyboardEvent) 
        {
            pad.activatePad();
        });

        keyObject.on('up', function(event: KeyboardEvent) 
        {
            pad.deactivatePad();
        });
        
        this._keyObject = keyObject;
    }

    public update()
    {
        const active = this._active;

        const screenPosition = ThreeScene.projectToScreen(this.object.object.position);
        this.position.set(screenPosition.x, screenPosition.y);

        this.container.setPosition(this.position.x, this.position.y);

        if(this.spriteColor)
        {
            this.spriteColor.tint = active ? this.color : 0x777777;
        }
    }
}