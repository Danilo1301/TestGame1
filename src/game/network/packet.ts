import { eMatchStatus, MatchData } from "../gameface/matchData"

export enum PACKET_TYPE {
    PACKET_EVENT,
    PACKET_MATCH_DATA,
    PACKET_MATCH_STATUS_CHANGE,
    PACKET_MATCH_DATA_TO_START_GAME,
    PACKET_MATCH_CONFIRM_START_GAME
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

export interface IPacketData_MatchData {
    matchData: MatchData
}

export interface IPacketData_MatchStatusChange {
    newStatus: eMatchStatus
}

export interface IPacketData_DataToStartGame {
    matchData: MatchData
}