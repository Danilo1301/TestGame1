import { eMatchStatus, MatchData } from "../gameface/matchData"

export enum PACKET_TYPE {
    PACKET_EVENT,
    PACKET_MATCH_STATUS_CHANGE,
    PACKET_MATCH_DATA_TO_START_GAME,
    PACKET_MATCH_CONFIRM_START_GAME,
    PACKET_PAD_DOWN_OR_UP,
    PACKET_NOTE_MISS,
    PACKET_FORCE_FINISH
}

export interface IPacketData {
    
}

export interface IPacket {
    type: PACKET_TYPE
    data: IPacketData
}

export interface IPacketData_Event {
    eventId: string
    data: any
}

export interface IPacketData_MatchStatusChange {
    newStatus: eMatchStatus
    message: string
}

export interface IPacketData_DataToStartGame {
    matchData: MatchData
}

export interface IPacketData_PadDownOrUp {
    down: boolean
    index: number
    time: number
}

export interface IPacketData_ForceFinish {
    money: number
}