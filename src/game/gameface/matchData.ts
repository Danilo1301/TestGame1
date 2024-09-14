export enum eMatchStatus {
    NONE = "NONE",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
    ERROR = "ERROR",
    DISCONNECTED = "DISCONNECTED"
};

export interface MatchData {
    status: eMatchStatus
    matchId: string
    songId: string
    userId: string
    betValue: number
}