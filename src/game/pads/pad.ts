import { AudioManager } from "../../utils/audioManager/audioManager";
import { BaseObject } from "../../utils/baseObject";
import { Input } from "../../utils/input/input";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { eNoteHitGood, PadData } from "../gameface/gameLogic";
import { IPacketData_PadDownOrUp, PACKET_TYPE } from "../network/packet";
import { Note } from "../notes/note";
import { EditorScene } from "../scenes/editor/editorScene";
import { GameScene } from "../scenes/gameScene/gameScene";
import { MainScene } from "../scenes/mainScene";
import { PadHitText } from "./padHitText";

export class Pad extends BaseObject
{
    public padData: PadData;

    public container!: Phaser.GameObjects.Container;
    public sprite?: Phaser.GameObjects.Sprite;
    public spriteColor?: Phaser.GameObjects.Sprite;

    public object: Phaser3DObject;
    public position: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    public padHitText: PadHitText;

    public draggingNote?: Note;
    public startedDragAtTime: number = 0;

    private _active: boolean = false;

    private _lastTimeAwardedScoreByDragging: number = 0;

    public color: number = 0x0000ff;

    public pointerIdPressingThisPad: number = 0;

    constructor(padData: PadData, object: Phaser3DObject)
    {
        super();

        this.padData = padData;

        this.object = object;
        //this.object.debugText.createDebugText();
        this.object.setInvisible();

        const scene = GameScene.Instance;
        
        this.container = scene.add.container(50, 50);
        MainScene.Instance.layerNotes.add(this.container);

        this.sprite = scene.add.sprite(0, 0, 'pad_sheet', 'pad_color1.png');    
        this.sprite.setScale(2.2);
        this.container.add(this.sprite);
        
        this.spriteColor = scene.add.sprite(0, 0, 'pad_sheet', 'pad_color2.png');    
        this.spriteColor.setScale(2.2);
        this.container.add(this.spriteColor);

        this.padHitText = new PadHitText(scene);
        this.container.add(this.padHitText.container);

        const pad = this;
        
        Input.events.on("pointerdown", (event: PointerEvent, pointerId: number) => {
            //console.log("poniter down")

            const mousePosition = Input.mousePosition;
            const position = this.position;
            const distance = position.distance(mousePosition);

            //console.log(mousePosition, distance)

            if(distance < 70)
            {
                //console.log(distance)
                this.pointerIdPressingThisPad = pointerId;
                this.activatePad();
            }
        });

        Input.events.on("pointerup", (event: PointerEvent, pointerId: number) => {

            if(this.pointerIdPressingThisPad != pointerId) return;

            this.deactivatePad();
        });
    }

    public activatePad()
    {
        this._active = true;
        
        this.spriteColor?.anims.play('pad_color_raise');    

        const index = this.getIndex();

        const padDownData = Gameface.Instance.gameLogic.processPadDown(index);

        Gameface.Instance.network.send<IPacketData_PadDownOrUp>(PACKET_TYPE.PACKET_PAD_DOWN_OR_UP, {
            down: true,
            index: this.getIndex(),
            time: Gameface.Instance.gameLogic.songTime
        })

        if(padDownData != undefined)
        {
            const hitType = padDownData.hitType;
            const noteData = padDownData.note;

            const countAsHit = hitType != eNoteHitGood.HIT_NOT_ON_TIME;
    
            if(countAsHit)
            {
                //GameScene.Instance.onNoteHit(note, hitType, false);
                
                if(Gameface.Instance.sceneManager.hasSceneStarted(EditorScene)) return
                
                const note = GameScene.Instance.notes.getNoteByNoteData(noteData);

                this.hitNote(note);
            }
        }

        GameScene.Instance.events.emit("pad_down", this);
    }

    public hitNote(note: Note)
    {
        this.padHitText.show();

        if(note.songNote.dragTime > 0)
        {
            //moved to gamelogic
            //this.startDrag(note);
        }
    }

    public startDrag(note: Note)
    {
        console.warn("start drag")

        note.startBeeingDragged(this);

        this.draggingNote = note;
        this.startedDragAtTime = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        this._lastTimeAwardedScoreByDragging = this.startedDragAtTime;

        GameScene.Instance.events.emit("pad_begin_drag", this, note);
    }

    public stopDrag()
    {
        console.warn("pad.stopDrag");

        const note = this.draggingNote;

        if(!note) return;

        note.stopBeeingDragged();
        
        this.draggingNote = undefined;
        this.startedDragAtTime = 0;
        
        //GameScene.Instance.onNoteHit(note, hitType, true);

        //GameScene.Instance.events.emit("pad_end_drag", this, note);
    }

    public deactivatePad()
    {
        if(!this._active) return;

        this._active = false;

        this.spriteColor?.anims.playReverse('pad_color_raise');

        Gameface.Instance.gameLogic.processPadUp(this.getIndex());

        Gameface.Instance.network.send<IPacketData_PadDownOrUp>(PACKET_TYPE.PACKET_PAD_DOWN_OR_UP, {
            down: false,
            index: this.getIndex(),
            time: Gameface.Instance.gameLogic.songTime
        })

        //this.stopDrag();
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
        const keyBoard = Gameface.Instance.input.input.keyboard;

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
    }

    public update(delta: number)
    {
        this.padHitText.update(delta);

        const active = this._active;

        // set position
        const screenPosition = ThreeScene.projectToScreen(this.object.object.position);
        this.position.set(screenPosition.x, screenPosition.y);

        this.container.setPosition(this.position.x, this.position.y);

        //set colors
        if(this.spriteColor)
        {
            this.spriteColor.tint = active ? this.color : 0x777777;
        }

        if(this.sprite)
        {
            this.sprite.tint = this.color;
        }

        //award score
        if(this.draggingNote)
        {
            console.warn("implement this");
            
            /*
            const now = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
            if(now - this._lastTimeAwardedScoreByDragging >= 500)
            {
                this._lastTimeAwardedScoreByDragging = now;

                GameScene.Instance.score += 100;
            }
            */
        }
    }
}