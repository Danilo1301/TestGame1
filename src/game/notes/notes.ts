import { BaseObject } from "../../utils/baseObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { randomIntFromInterval } from "../../utils/utils";
import { SongNote } from "../constants/songs";
import { NoteData } from "../gameface/gameLogic";
import { GameScene } from "../scenes/gameScene/gameScene";
import { Note } from "./note";

export class Notes extends BaseObject
{
    public static noteTimeToAchieve = 1000;

    public delta: number = 0;

    public get notes() { return this._notes; };
    private _notes: Note[] = [];

    public get soundPlayer() { return GameScene.Instance.soundPlayer; }

    constructor()
    {
        super();
    }

    public spawnNote(noteData: NoteData)
    {
        //const pad = GameScene.Instance.pads.getPad(padIndex);
        //const padPosition = pad.object.object.position;

        //const scene = ThreeScene.Instance;

        const note = new Note(noteData);
        note.padIndex = noteData.padIndex;

        this._notes.push(note);

        note.update();
        
        /*
        const position = pad.getPosition();

        const distance = this.getSpawnNoteDistance();
        */
        
        return note;
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
        
        const notesToDestroy: Note[] = [];

        for(const note of this._notes)
        {
            note.update();

            if(!note.noteData.isInGameField()) continue;

            note.updatePositionRelativeToPad();
            note.updateContainerPosition(); //to fix position not syncing
        }

        for(const note of notesToDestroy)
        {
            this._notes.splice(this._notes.indexOf(note), 1);

            note.destroy();
        }
    }

    public getNoteByNoteData(noteData: NoteData)
    {
        for(const note of this.notes)
        {
            if(note.noteData == noteData) return note;
        }
        throw `Notes: Could not find note by note data`;
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
        const timeToAchieve = Notes.noteTimeToAchieve;

        const amount = distanceToMove / timeToAchieve * delta;

        return amount;
    }

    public getDistanceFromMs(ms: number)
    {
        const distanceToMove = this.getSpawnNoteDistance();
        const timeToAchieve = Notes.noteTimeToAchieve;

        const mettersPerMs = distanceToMove/timeToAchieve;

        //3m / 1000ms
        //0.03 m/ms

        return mettersPerMs * ms;
    }

    public isDistanceBetweenMsInterval(distance: number, ms: number)
    {
        const distanceFromMs = this.getDistanceFromMs(ms);

        const goodDistance = distanceFromMs / 2;

        //console.log(`check if ${distance.toFixed(2)} <= ${goodDistance.toFixed(2)}`)

        if(distance <= goodDistance) return true;

        return false;
    }

    public getLastNote()
    {
        const notes = this._notes.sort((a, b) => a.songNote.time - b.songNote.time);

        const lastNote = notes[notes.length-1];

        return lastNote;
    }

    public getNotesHitted()
    {
        return this._notes.filter(note => note.noteData.hitted);
    }

    public getNotesMissed()
    {
        return this._notes.filter(note => note.noteData.missed);
    }
}