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

        this.spawnNote(position.x, position.y, position.z - distance);
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
}