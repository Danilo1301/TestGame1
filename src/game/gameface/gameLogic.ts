import { BaseObject } from "../../utils/baseObject";
import { EventHandler } from "../../utils/eventHandler";
import { Interval, isNumberBetweenInverval } from "../../utils/interval";
import { gameSettings } from "../constants/gameSettings";
import { Song, SongNote } from "../constants/songs";
import { eMatchStatus, MatchData } from "./matchData";

export enum eNoteHitGood
{
    HIT_PERFECT,
    HIT_GOOD,
    HIT_OK,
    HIT_BAD,
    HIT_NOT_ON_TIME
}

export class NoteData {
    public gameLogic: GameLogic;
    public padIndex: number;
    public songNote: SongNote;

    public hitted: boolean = false;
    public missed: boolean = false;

    constructor(gameLogic: GameLogic, padIndex: number, songNote: SongNote)
    {
        this.gameLogic = gameLogic;
        this.padIndex = padIndex;
        this.songNote = songNote;
    }

    public isInGameField()
    {
        if(!this.hasNotePassedStartOfGameField()) return false;

        if(!this.isDragPassedEndOfGameField()) return true;

        return false;
    }

    public isDragPassedEndOfGameField()
    {
        const time = this.gameLogic.songTime;
        const end = this.getTimeOfEndOfGameField();

        if(time > end + this.songNote.dragTime)
        {
            return true;
        }

        return false;
    }

    public hasNotePassedStartOfGameField()
    {
        const time = this.gameLogic.songTime;
        const start = this.songNote.time - 3000;

        if(time >= start)
        {
            return true;
        }
        return false;
    }

    public hasPassedEndGameField()
    {
        const time = this.gameLogic.songTime;

        const end = this.getTimeOfEndOfGameField();

        return time > end;
    }

    public getTimeOfEndOfGameField()
    {
        const end = this.songNote.time + 200;
        return end;
    }
}

export class PadData {
    public index: number;

    constructor(index: number)
    {
        this.index = index;
    }
}

export enum eGameLogicEvents {
    EVENT_NOTE_HIT = "EVENT_NOTE_HIT",
    EVENT_BREAK_COMBO = "EVENT_BREAK_COMBO"
}

const scoreMap = new Map<eNoteHitGood, number>([
    [eNoteHitGood.HIT_PERFECT, 100],
    [eNoteHitGood.HIT_GOOD, 80],
    [eNoteHitGood.HIT_OK, 50],
    [eNoteHitGood.HIT_BAD, 10],
    [eNoteHitGood.HIT_NOT_ON_TIME, 0],
]);

export class GameLogic extends BaseObject {
    public song?: Song;

    public money: number = 0;
    public accumulatedMoney: number = 0;
    public combo: number = 0;
    public score: number = 0;

    public events = new EventHandler();

    public pads: PadData[] = [];
    public notes: NoteData[] = [];

    public songTime: number = 0;

    public matchData: MatchData = {
        status: eMatchStatus.NONE,
        matchId: "",
        songId: "",
        userId: "",
        betValue: 0
    }

    public create()
    {
        this.createNotes();
    }

    public createPads()
    {
        const numOfPads = 5;

        for(let i = 0; i < numOfPads; i++)
        {
            const padData = new PadData(i);
            this.pads.push(padData);
        }
    }

    public createNotes()
    {
        if(this.notes.length > 0)
        {
            throw "GameLogic: Alreay created notes";
        }

        const song = this.song!;

        for(const songNote of song.notes)
        {
            for(const padIndex of songNote.pads)
            {
                const note = new NoteData(this, padIndex, songNote);
                this.notes.push(note);
            }
        }

        this.log("Created " + this.notes.length + " notes");
    }

    public missNote()
    {

    }

    public processPadDown(padIndex: number, songTime: number)
    {
        this.songTime = songTime;

        this.log("pad down", padIndex);

        const note = this.getClosestNoteForPad(padIndex);
        console.log(note);

        if(note)
        {
            if(!note.hitted)
            {
                const time = this.songTime;
                const noteTime = note.songNote.time;
                const distanceInMs = noteTime - time;

                const hitType = this.getHowGoodNoteIs(distanceInMs);

                console.log(hitType)

                if(hitType != undefined)
                {
                    const countAsHit = hitType != eNoteHitGood.HIT_NOT_ON_TIME;
        
                    if(countAsHit)
                    {
                        this.log("note hit");

                        this.onNoteHit(note, hitType);
            
                    } else {
                        //this.events.emit(eGameLogicEvents.EVENT_NOTE_BREAK_COMBO, note, hitType);

                        //GameScene.Instance.breakCombo();
                    }

                    return {hitType: hitType, note: note};
                }
            }
        }

        return undefined;
    }

    private _prevHitSongNote?: NoteData;

    private onNoteHit(note: NoteData, hitType: eNoteHitGood)
    {
        this.log("on note hit")

        note.hitted = true;

        if(this._prevHitSongNote != note)
        {
            this._prevHitSongNote = note;
            this.combo++;

            this.log("combo " + this.combo)

            const notesToReward = gameSettings.comboAward;

            var betValue = this.matchData.betValue;
            var maxGanho = betValue * 10;

            var notas = this.notes.length;

            var porNota = maxGanho / notas;

            this.accumulatedMoney += porNota;

            if(this.combo % notesToReward == 0 && this.combo != 0)
            {
                this.money += this.accumulatedMoney;
                this.accumulatedMoney = 0;

                //this.infoText.showRandomHitMessage();
            }
        }

        const addScore = scoreMap.get(hitType);
        if(addScore) this.score += addScore;

        this.events.emit(eGameLogicEvents.EVENT_NOTE_HIT, note, hitType);
    }

    public breakCombo()
    {
        this.events.emit(eGameLogicEvents.EVENT_BREAK_COMBO);
        this.combo = 0;
    }

    public getHowGoodNoteIs(ms: number)
    {
        this.log("how good is", ms);

        const makeInterval = (ms: number) =>
        {
            const interval: Interval = {
                from: -ms/2,
                to: ms/2
            }
            return interval;
        }

        if(isNumberBetweenInverval(ms, makeInterval(100))) return eNoteHitGood.HIT_PERFECT;
        if(isNumberBetweenInverval(ms, makeInterval(120))) return eNoteHitGood.HIT_GOOD;
        if(isNumberBetweenInverval(ms, makeInterval(150))) return eNoteHitGood.HIT_OK;
        if(isNumberBetweenInverval(ms, makeInterval(250))) return eNoteHitGood.HIT_BAD;

        return eNoteHitGood.HIT_NOT_ON_TIME;
    }

    public getClosestNoteForPad(padIndex: number)
    {
        let closestDistance = Infinity;
        let closestNote: NoteData | undefined = undefined;

        const pad = this.pads[padIndex];

        for(const note of this.notes)
        {
            if(!note.isInGameField()) continue;

            if(note.padIndex != padIndex) continue;
            //if(!note.canMove) continue;

            const time = this.songTime;

            const distance = note.songNote.time - time;

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