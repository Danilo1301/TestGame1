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
    bpms: BPMChange[]
    offset: number
    notes: SongNote[]
}

export const songs: Song[] = [
    {
        name: "Guns N' Roses - Sweet Child O' Mine - Teste",
        sound: "sound6",
        bpms: [
            {time: 0, bpm: 400},
            {time: 760, bpm: 77},
            {time: 6900, bpm: 144},
            {time: 11300, bpm: 77}
        ],
        offset: 0,
        notes: [
            {time: 1875, pads: [0,4], dragTime: 468.75},
            {time: 2500, pads: [3], dragTime: 3000}
        ]
    }
];