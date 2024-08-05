import { BaseObject } from "../../utils/baseObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { randomIntFromInterval } from "../../utils/utils";
import { SongNote } from "../constants/songs";
import { GameScene } from "../scenes/gameScene/gameScene";
import { Note } from "./note";

export class Notes extends BaseObject
{
    public delta: number = 0;

    public get notes() { return this._notes; };
    private _notes: Note[] = [];

    public get soundPlayer() { return GameScene.Instance.soundPlayer; }

    constructor()
    {
        super();
    }

    public spawnNoteForPad(padIndex: number, songNote: SongNote)
    {
        const pad = GameScene.Instance.pads.getPad(padIndex);
        const padPosition = pad.object.object.position;

        const scene = ThreeScene.Instance;

        const box = scene.third.add.box({width: 0.1, height: 0.1, depth: 0.1});
        const object = ThreeScene.addPhaser3DObject(box);
        object.name = "Note " + this._notes.length;
        box.position.set(padPosition.x, padPosition.y, padPosition.z);

        const note = new Note(object);
        note.songNote = songNote;
        note.padIndex = padIndex;

        this._notes.push(note);
        
        /*
        const position = pad.getPosition();

        const distance = this.getSpawnNoteDistance();
        */
        
        return note;
    }

    public spawnRandomNoteForPad()
    {
        const numOfPads = GameScene.Instance.pads.numOfPads;
        const padIndex = randomIntFromInterval(0, numOfPads-1);

        const songNote: SongNote = {
            time: this.soundPlayer.getCurrentAudioTime() + 2000,
            pads: [padIndex],
            dragTime: 0
        }

        return this.spawnNoteForPad(padIndex, songNote);
    }

    public destroyNotes()
    {
        for(const note of this._notes)
        {
            note.destroy();
        }

        this._notes = [];
    }

    public update(delta: number)
    {
        this.delta = delta;

        this.getMovementSpeed();
        
        const notesToDestroy: Note[] = [];

        for(const note of this._notes)
        {
            const pad = GameScene.Instance.pads.getPad(note.padIndex);

            let z = pad.object.object.position.z;
            let ms = (this.soundPlayer.getCurrentAudioTime() * 1000) - note.songNote.time;
            z += GameScene.Instance.notes.getDistanceFromMs(ms);

            note.setZPosition(z);

            note.update();
        }

        for(const note of notesToDestroy)
        {
            this._notes.splice(this._notes.indexOf(note), 1);

            note.destroy();
        }
    }

    public getSpawnNoteDistance()
    {
        const z = GameScene.Instance.ground.plankSize;
        return z;
    }

    public getMovementSpeed()
    {
        const delta = this.delta;
        const distanceToMove = this.getSpawnNoteDistance();
        const timeToAchieve = this.soundPlayer.soundDelay;

        const amount = distanceToMove / timeToAchieve * delta;

        return amount;
    }

    public getDistanceFromMs(ms: number)
    {
        const distanceToMove = this.getSpawnNoteDistance();
        const timeToAchieve = this.soundPlayer.soundDelay;

        const mettersPerMs = distanceToMove/timeToAchieve;

        //3m / 1000ms
        //0.03 m/ms

        return mettersPerMs * ms;
    }

    public isDistanceBetweenMsInterval(distance: number, ms: number)
    {
        const distanceFromMs = this.getDistanceFromMs(ms);

        const goodDistance = distanceFromMs / 2;

        console.log(`check if ${distance.toFixed(2)} <= ${goodDistance.toFixed(2)}`)

        if(distance <= goodDistance) return true;

        return false;
    }

    public getClosestNoteForPad(padIndex: number)
    {
        let closestDistance = Infinity;
        let closestNote: Note | undefined = undefined;

        const pad = GameScene.Instance.pads.getPad(padIndex);

        for(const note of this._notes)
        {
            if(note.padIndex != padIndex) continue;
            if(!note.canMove) continue;

            const distance = note.getDistanceFromPad(pad);

            //if(distance > 1.0) continue;

            if(distance < closestDistance)
            {
                closestNote = note;
                closestDistance = distance;
            }
        }

        return closestNote;
    }
}