import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
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

    private _spawnNoteDistance = 3;

    constructor()
    {
        super();

        this._soundNotes = new SoundNotes();
    }

    public spawnNoteForPad(padIndex: number)
    {
        const pad = GameScene.Instance.pads.getPad(padIndex);
        const position = pad.getPosition();

        const distance = this._spawnNoteDistance;

        const note = this.spawnNote(position.x, position.y, position.z - distance);
        note.padIndex = padIndex;
    }

    public spawnRandomNoteForPad()
    {
        const numOfPads = GameScene.Instance.pads.numOfPads;
        const padIndex = randomIntFromInterval(0, numOfPads-1);
        this.spawnNoteForPad(padIndex);
    }

    public spawnNote(x: number, y: number, z: number)
    {
        const mesh = Three.createBox(0.1, 0.1, 0.1);
        mesh.position.set(x, y, z);

        const meshObject = Three.addMeshObject(mesh);
        meshObject.name = "Note";

        const note = new Note(meshObject);
    
        this._notes.push(note);

        return note;
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

            if(note.meshObject.mesh.position.z >= 2)
            {
                notesToDestroy.push(note);
            }
        }

        for(const note of notesToDestroy)
        {
            this._notes.splice(this._notes.indexOf(note), 1);

            note.destroy();
        }
    }

    public getMovementSpeed()
    {
        const delta = this.delta;
        const distanceToMove = this._spawnNoteDistance;
        const timeToAchieve = 1000;

        const amount = distanceToMove / timeToAchieve * delta;

        return amount;
    }

    public getDistanceFromMs(ms: number)
    {
        const distanceToMove = this._spawnNoteDistance;
        const timeToAchieve = 1000;

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