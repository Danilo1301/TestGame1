import { BaseObject } from "../../utils/baseObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { randomIntFromInterval } from "../../utils/utils";
import { GameScene } from "../scenes/gameScene";
import { Note } from "./note";
import { SoundNotes } from "./soundNotes";

export class Notes extends BaseObject
{
    public delta: number = 0;

    public get notes() { return this._notes; };
    public get soundNotes() { return this._soundNotes; };

    private _notes: Note[] = [];
    private _soundNotes: SoundNotes;

    constructor()
    {
        super();

        this._soundNotes = new SoundNotes();
    }

    public spawnNote(x: number, y: number, z: number)
    {
        const scene = ThreeScene.Instance;

        const box = scene.third.add.box({width: 0.1, height: 0.1, depth: 0.1});
        const object = ThreeScene.addPhaser3DObject(box);
        object.name = "Note " + this._notes.length;
        box.position.set(x, y, z);

        const note = new Note(object);
    
        this._notes.push(note);

        return note;
    }

    public spawnNoteForPad(padIndex: number)
    {
        const pad = GameScene.Instance.pads.getPad(padIndex);
        const position = pad.getPosition();

        const distance = this.getSpawnNoteDistance();

        const note = this.spawnNote(position.x, position.y, position.z - distance);
        note.padIndex = padIndex;
        return note;
    }

    public spawnRandomNoteForPad()
    {
        const numOfPads = GameScene.Instance.pads.numOfPads;
        const padIndex = randomIntFromInterval(0, numOfPads-1);
        return this.spawnNoteForPad(padIndex);
    }

    public update(delta: number)
    {
        this.delta = delta;

        this.getMovementSpeed();

        this.soundNotes.update(delta);
        
        const notesToDestroy: Note[] = [];

        for(const note of this._notes)
        {
            note.movementSpeed = this.getMovementSpeed();
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
        const timeToAchieve = this.soundNotes.soundDelay;

        const amount = distanceToMove / timeToAchieve * delta;

        return amount;
    }

    public getDistanceFromMs(ms: number)
    {
        const distanceToMove = this.getSpawnNoteDistance();
        const timeToAchieve = this.soundNotes.soundDelay;

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

            if(distance > 0.3) continue;

            if(distance < closestDistance)
            {
                closestNote = note;
                closestDistance = distance;
            }
        }

        return closestNote;
    }
}