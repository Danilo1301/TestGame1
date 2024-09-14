export interface SongNote {
    time: number
    pads: number[]
    dragTime: number
}

export interface BPMChange {
    time: number
    bpm: number
}

export interface Song {
    name: string
    sound: string
    offset: number
    bpms: BPMChange[]
    notes: SongNote[]
}