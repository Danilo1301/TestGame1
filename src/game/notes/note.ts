import * as THREE from "three";
import { BaseObject } from "../../utils/baseObject";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { Pad } from "../pads/pad";
import { GameScene } from "../scenes/gameScene/gameScene";
import { MainScene } from "../scenes/mainScene";
import { SongNote } from "../constants/songs";
import { Input } from "../../utils/input/input";
import { Button } from "../../utils/ui/button";
import { EditorScene } from "../scenes/editor/editorScene";
import { Hud } from "../hud/hud";

export class Note extends BaseObject
{
    public songNote: SongNote = {
        time: 0,
        pads: [],
        dragTime: 0
    };
    public visible: boolean = true;
    public noteVisible: boolean = true;
    public destroyed: boolean = false;

    public container?: Phaser.GameObjects.Container;
    public image?: Phaser.GameObjects.Image;
    public image_color?: Phaser.GameObjects.Image;

    public canMove: boolean = true;
    public padIndex: number = -1;
    public object: Phaser3DObject;

    public dragObject?: Phaser3DObject;
    public dragTotalSize: number = 5;
    public dragSize: number = this.dragTotalSize;
    public draggedByPad?: Pad;

    public moreOptionsNoteButton?: Button;

    constructor(object: Phaser3DObject)
    {
        super();

        this.object = object;
    }

    public update()
    {
        const scene = GameScene.Instance;

        if(this.visible)
        {
            if(!this.container)
            {
                this.container = scene.add.container(0, 0);
                Hud.addToHudLayer(this.container);
            }

            if(this.noteVisible)
            {
                if(!this.image)
                {
                    this.image = scene.add.image(0, 0, "note");
                    this.container.add(this.image);    
                }

                if(!this.image_color)
                {
                    this.image_color = scene.add.image(0, 0, "note_color");
                    this.container.add(this.image_color);    
                }

                const pad = GameScene.Instance.pads.getPad(this.padIndex);
                if(pad) this.image_color.setTint(pad.color);
            } else {
                this.image?.destroy();
                this.image = undefined;

                this.image_color?.destroy();
                this.image_color = undefined;
            }
        } else {
            if(this.container)
            {
                this.container.destroy();
            }
        }

        //

        const object = this.object.object;
        const dragObject = this.dragObject?.object;

        if(dragObject)
        {
            const newPosition = object.position.clone();
            
            if(this.draggedByPad)
            {
                const pad = this.draggedByPad;
                const padPosition = pad.object.object.position;

                const currentTime = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
                const dragTime = this.songNote.dragTime;
                const noteTime = this.songNote.time;
                const originalSize = GameScene.Instance.notes.getDistanceFromMs(dragTime);
                const startedDragAt = pad.startedDragAtTime * 1000;

                const diff = noteTime - startedDragAt;

                const pressedDiff = currentTime - startedDragAt;

                console.log("originalSize", originalSize);
                console.log("pressedDiff", pressedDiff);
                console.log("diff", diff);

                this.dragSize = originalSize + GameScene.Instance.notes.getDistanceFromMs(diff);
                this.dragSize -= GameScene.Instance.notes.getDistanceFromMs(pressedDiff);

                newPosition.set(padPosition.x, padPosition.y, padPosition.z);
            } else {
            }

            newPosition.z -= this.dragSize/2;

            dragObject.scale.set(1, this.dragSize, 1);
            dragObject.position.set(newPosition.x, newPosition.y, newPosition.z);
            this.dragObject!.debugText.setLine("size", this.dragSize.toFixed(2));
        }

        if(this.container)
        {
            const screenPosition = ThreeScene.projectToScreen(object.position);

            this.container.setPosition(screenPosition.x, screenPosition.y);

            const scale = this.getScale();

            //this.object.debugText.setLine("scale", `x${scale.toFixed(2)}`);

            this.container.setScale(scale);

            const distanceFromMouse = this.getDistanceFromMouse();

            if(distanceFromMouse < 30 && EditorScene.showNoteOptionsButton)
            {
                if(!this.moreOptionsNoteButton)
                {
                    this.moreOptionsNoteButton = new Button(MainScene.Instance, "+", 0, 0, 30, 30, "button");
                    this.moreOptionsNoteButton.onClick = () => {
                        EditorScene.Instance.openNoteOptions(this.songNote.time);
                    };
                    this.container.add(this.moreOptionsNoteButton.container)
                }
            } else {
                if(this.moreOptionsNoteButton)
                {
                    this.moreOptionsNoteButton.destroy();
                    this.moreOptionsNoteButton = undefined;
                }
            }
        }
    }

    public getScale()
    {
        return this.object.getScale() * 0.8;
    }

    public getDistanceFromMouse()
    {
        if(!this.container) return 0;

        const mousePosition = Input.mousePosition;
        return mousePosition.distance(new Phaser.Math.Vector2(this.container.x, this.container.y));
    }

    public destroy()
    {
        this.destroyed = true;

        this.object.destroy();

        this.dragObject?.destroy();
        this.dragObject = undefined

        this.image?.destroy();
        this.image = undefined;

        this.image_color?.destroy();
        this.image_color = undefined;

        this.container?.destroy();
        this.container = undefined;

        this.moreOptionsNoteButton?.destroy()
        this.moreOptionsNoteButton = undefined;
    }

    public getDistanceFromPad(pad: Pad)
    {
        const padPosition = pad.object.object.position;
        const position = this.object.object.position;

        const distance = padPosition.distanceTo(position);
        return distance;
    }

    private createDragPart(size: number)
    {
        const threeScene = ThreeScene.Instance;

        const shapeSize = new THREE.Vector2(0.1, 1);

        //ground
        const texture = new THREE.TextureLoader().load('assets/drag.png');
        const material = new THREE.MeshStandardMaterial({ map: texture });

        // Cria o cubo com a geometria personalizada e o material
        const obj = threeScene.third.add.plane({
            width: shapeSize.x,
            height: shapeSize.y,
            x: 0,
            y: 0,
            z: 0
        }, {custom: material});

        const object = ThreeScene.addPhaser3DObject(obj);
        object.name = "Drag";

        obj.rotation.x = Math.PI / 2;
        obj.position.set(0, 2, 0);

        return object;
    }

    public setDragSize(size: number)
    {
        this.dragSize = size;

        if(size > 0)
        {
            if(!this.dragObject)
            {
                this.dragObject = this.createDragPart(this.dragSize);
            }
        }
    }

    public setAsHitted()
    {
        console.log("note hit!");

        if(this.songNote.dragTime == 0)
        {
            this.visible = false;
            this.destroy();
        } else {
            this.noteVisible = false;
        }

        //GameScene.Instance.notes.soundNotes.audio!.playbackRate = 0.5;
    }

    public setZPosition(z: number)
    {
        this.object.object.position.z = z;
    }

    public startBeeingDragged(pad: Pad)
    {
        this.draggedByPad = pad;
    }

    public stopBeeingDragged()
    {
        this.draggedByPad = undefined;

        this.visible = false;
    }
}