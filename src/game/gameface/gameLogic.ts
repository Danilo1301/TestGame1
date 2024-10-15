import { BaseObject } from "../../utils/baseObject";
import { EventHandler } from "../../utils/eventHandler";
import { Interval, isNumberBetweenInverval } from "../../utils/interval";
import { clamp } from "../../utils/utils";
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
    public draggingNote?: NoteData;

    constructor(index: number)
    {
        this.index = index;
    }
}

export enum eGameLogicEvents {
    EVENT_NOTE_HIT = "EVENT_NOTE_HIT",
    EVENT_BREAK_COMBO = "EVENT_BREAK_COMBO",
    EVENT_COMBO_REWARD = "EVENT_COMBO_REWARD",
    EVENT_PAD_BEGIN_DRAG = "EVENT_PAD_BEGIN_DRAG",
    EVENT_PAD_END_DRAG = "EVENT_PAD_END_DRAG"
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

    public createAll()
    {
        this.createNotes();
        this.createPads();
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

    public processPadDown(padIndex: number)
    {
        //this.log("pad down", padIndex);

        const note = this.getClosestNoteForPad(padIndex);
   
        if(note)
        {
            if(!note.hitted)
            {
                const time = this.songTime;
                const noteTime = note.songNote.time;
                const distanceInMs = noteTime - time;

                if(distanceInMs < 500)
                {
                    const hitType = this.getHowGoodNoteIs(distanceInMs);

                    this.log(`note hit at ${time}, distanceInMs=${distanceInMs}`);

                    const countAsHit = hitType != eNoteHitGood.HIT_NOT_ON_TIME;
        
                    if(countAsHit)
                    {
                        this.onNoteHit(note, hitType, false);
                    } else {
                        this.breakCombo();
                    }

                    return {hitType: hitType, note: note};
                }
            }
        }

        return undefined;
    }

    public processPadUp(padIndex: number)
    {
        const pad = this.pads[padIndex];

        if(!pad.draggingNote) return;

        const note = pad.draggingNote;
        
        const time = this.songTime;

        const end = note.songNote.time + note.songNote.dragTime;

        //console.log(`start: ${note.songNote.time}`);
        //console.log(`end: ${note.songNote.time + note.songNote.dragTime}`);
        //console.log(`current: ${time}`);

        const distanceInMs = end - time;
        //console.log(`distance: (${distanceInMs}ms)`);

        const hitType = this.getHowGoodNoteIs(distanceInMs);
        //const distance = GameScene.Instance.notes.getDistanceFromMs(distanceInMs);

        //const countAsHit = hitType != eNoteHitGood.HIT_NOT_ON_TIME;

        pad.draggingNote = undefined;

        this.events.emit(eGameLogicEvents.EVENT_PAD_END_DRAG, note.padIndex);

        this.onNoteHit(note, hitType, true);
    }

    private _prevHitSongNote?: NoteData;

    private onNoteHit(note: NoteData, hitType: eNoteHitGood, isEndDrag: boolean)
    {
        //this.log("onNoteHit ", note, isEndDrag);

        if(isEndDrag)
        {
            if(hitType == eNoteHitGood.HIT_NOT_ON_TIME)
            {
                this.log("drag released off timing, breaking combo");

                this.breakCombo();

                return;
            }
        }

        note.hitted = true;

        if(this._prevHitSongNote?.songNote != note.songNote)
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

                this.events.emit(eGameLogicEvents.EVENT_COMBO_REWARD, note, hitType);

                this.log("Combo REWARD!");
            }
        }

        const addScore = scoreMap.get(hitType);
        if(addScore) this.score += addScore;

        this.events.emit(eGameLogicEvents.EVENT_NOTE_HIT, note, hitType);

        if(!isEndDrag)
        {
            if(note.songNote.dragTime > 0)
            {
                const pad = this.pads[note.padIndex];
                pad.draggingNote = note;

                this.events.emit(eGameLogicEvents.EVENT_PAD_BEGIN_DRAG, note.padIndex, note);

                //this.startDrag(note);
            }
        }
    }

    public breakCombo()
    {
        //this.log("breakCombo")

        this.events.emit(eGameLogicEvents.EVENT_BREAK_COMBO);
        this.combo = 0;
        this.accumulatedMoney = 0;

        // remove money
        var betValue = this.matchData.betValue;
        var maxGanho = betValue * 10;
        var notas = this.notes.length;
        var porNota = maxGanho / notas;

        this.money -= porNota;
        //
    }

    public getHowGoodNoteIs(ms: number)
    {
        //this.log("how good is", ms);

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

        for(const note of this.notes)
        {
            if(!note.isInGameField()) continue;

            if(note.padIndex != padIndex) continue;
            if(note.hitted) continue;
            if(note.missed) continue;

            const time = this.songTime;

            const distance = note.songNote.time - time;

            if(distance < closestDistance)
            {
                closestNote = note;
                closestDistance = distance;
            }
        }

        return closestNote;
    }

    public printBalanceInfo()
    {
        this.log(`balance: ${this.money} (+${this.accumulatedMoney})`)
    }

    public getNotesHitted()
    {
        return this.notes.filter(note => note.hitted);
    }

    public getNotesMissed()
    {
        return this.notes.filter(note => note.missed);
    }

    public getAccuracy()
    {
        const hittedNotes = this.getNotesHitted().length;
        const missedNotes = this.getNotesMissed().length;

        const totalNotes = hittedNotes + missedNotes;

        let hitRatio = clamp(missedNotes / totalNotes, 0, 1);
        if(Number.isNaN(hitRatio)) hitRatio = 0;

        return hitRatio;
    }

    public getMoneyEarned()
    {
        return this.money - this.matchData.betValue;
    }
}