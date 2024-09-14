export enum eMatchStatus {
    NONE = "NONE",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
    ERROR = "ERROR"
};

export interface MatchData {
    status: eMatchStatus
    matchId: string
    songId: string
    userId: string
    betValue: number
}