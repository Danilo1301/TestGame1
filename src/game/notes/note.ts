import * as THREE from "three";
import { BaseObject } from "../../utils/baseObject";
import { Phaser3DObject } from "../../utils/three/phaser3dObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { Gameface } from "../gameface/gameface";
import { Pad } from "../pads/pad";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";
import { SongNote } from "../constants/songs";

export class Note extends BaseObject
{
    public songNote: SongNote = {
        time: 0,
        pads: [],
        dragTime: 0
    };

    public image?: Phaser.GameObjects.Image;
    public canMove: boolean = true;
    public padIndex: number = -1;
    public object: Phaser3DObject;

    public dragObject?: Phaser3DObject;
    public dragTotalSize: number = 5;
    public dragSize: number = this.dragTotalSize;
    public draggedByPad?: Pad;

    constructor(object: Phaser3DObject)
    {
        super();

        this.object = object;

        const scene = GameScene.Instance;

        this.image = scene.add.image(0, 0, "note");
    }

    public update()
    {
        const object = this.object.object;
        const dragObject = this.dragObject?.object;

        if(dragObject)
        {
            const newPosition = object.position.clone();
            
            if(this.draggedByPad)
            {
                const pad = this.draggedByPad;
                const padPosition = pad.object.object.position;

                const currentTime = GameScene.Instance.notes.soundNotes.getCurrentAudioTime() * 1000;
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

                //this.dragSize = 

                /*
                const time = GameScene.Instance.notes.soundNotes.getCurrentAudioTime() * 1000;
                const dragTime = this.songNote.dragTime;
                const endTime = this.songNote.time + dragTime;

                this.dragScale = 1 - (time - startedDragAt) / (endTime - startedDragAt);
                */

                //console.log((time - startedDragAt) + "/" + (endTime - startedDragAt));

                newPosition.set(padPosition.x, padPosition.y, padPosition.z);
            } else {
            }

            newPosition.z -= this.dragSize/2;
            //newPosition.z -= this.dragScale * this.dragSize/2;

            dragObject.scale.set(1, this.dragSize, 1);
            dragObject.position.set(newPosition.x, newPosition.y, newPosition.z);
            this.dragObject!.debugText.setLine("size", this.dragSize.toFixed(2));

            if(this.dragSize <= 0)
            {
                this.draggedByPad = undefined;
            }
        }

        if(this.image)
        {
            const screenPosition = ThreeScene.projectToScreen(object.position);

            this.image.setPosition(screenPosition.x, screenPosition.y);

            const scale = this.getScale();

            //this.object.debugText.setLine("scale", `x${scale.toFixed(2)}`);

            this.image.setScale(scale);
        }
    }

    public getScale()
    {
        const object = this.object.object;

        const screenPos = ThreeScene.projectToScreen(object.position);

        const pos2 = object.position.clone();
        pos2.x += 0.1;
        const screenPos2 = ThreeScene.projectToScreen(pos2);

        const distance = screenPos.distanceTo(screenPos2);
        
        return distance * 0.08;
    }

    public destroy()
    {
        this.object.destroy();
        this.image?.destroy();
        this.image = undefined;
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
        //note.canMove = false;
        //note.image!.alpha = 0.1;

        this.image?.destroy();
        this.image = undefined;

        console.log(this.dragObject)

        //GameScene.Instance.notes.soundNotes.audio!.playbackRate = 0.5;
    }

    public setZPosition(z: number)
    {
        this.object.object.position.z = z;
    }
}