import { BaseObject } from "../../utils/baseObject";
import { ThreeScene } from "../../utils/three/threeScene";
import { randomIntFromInterval } from "../../utils/utils";
import { SongNote } from "../constants/songs";
import { GameScene } from "../scenes/gameScene/gameScene";
import { eNoteHitGood, Note } from "./note";

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
        //const pad = GameScene.Instance.pads.getPad(padIndex);
        //const padPosition = pad.object.object.position;

        //const scene = ThreeScene.Instance;

        const note = new Note();
        note.songNote = songNote;
        note.padIndex = padIndex;

        this._notes.push(note);

        note.update();
        
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
            time: this.soundPlayer.getCurrentSoundPosition() + 2000,
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
        
        const notesToDestroy: Note[] = [];

        for(const note of this._notes)
        {
            note.update();

            if(!note.isInGameField()) continue;

            note.updatePositionRelativeToPad();
            note.updateContainerPosition(); //to fix position not syncing
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

    public getHowGoodNoteIs(ms: number)
    {
        const distance = this.getDistanceFromMs(ms);

        if(this.isDistanceBetweenMsInterval(distance, 60)) return eNoteHitGood.HIT_PERFECT;
        if(this.isDistanceBetweenMsInterval(distance, 90)) return eNoteHitGood.HIT_GOOD;
        if(this.isDistanceBetweenMsInterval(distance, 120)) return eNoteHitGood.HIT_OK;
        if(this.isDistanceBetweenMsInterval(distance, 150)) return eNoteHitGood.HIT_BAD;

        return eNoteHitGood.HIT_NOT_ON_TIME;
    }

    public getClosestNoteForPad(padIndex: number)
    {
        let closestDistance = Infinity;
        let closestNote: Note | undefined = undefined;

        const pad = GameScene.Instance.pads.getPad(padIndex)!;

        for(const note of this._notes)
        {
            if(!note.isInGameField()) continue;

            if(note.padIndex != padIndex) continue;
            //if(!note.canMove) continue;

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

    public getLastNote()
    {
        const notes = this._notes.sort((a, b) => a.songNote.time - b.songNote.time);

        const lastNote = notes[notes.length-1];

        return lastNote;
    }

    public getNotesHitted()
    {
        return this._notes.filter(note => note.hitted);
    }

    public getNotesMissed()
    {
        return this._notes.filter(note => note.missed);
    }
}