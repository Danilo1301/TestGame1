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

export const songIds: string[] = [
    "song1"
]

export const songs: Song[] = [
    {
        name: "Foghat - Slow Ride",
        sound: "sound7",
        offset: 0,
        bpms: [
            {time: 0, bpm: 100},
            {time: 2264.2459999999996, bpm: 59},
            {time: 20496.82, bpm: 117},
            {time: 37025.486, bpm: 117},
            {time: 42741.315, bpm: 117},
            {time: 46916.36, bpm: 117},
            {time: 50586.802, bpm: 117},
        ],
        notes: [
            {time: 2264.6600000000003, pads: [2], dragTime: 0},
        ]
    },
    {
        name: "[Test] Guns N' Roses - Sweet Child O' Mine",
        sound: "sound6",
        offset: 0,
        bpms: [
            {time: 0, bpm: 400},
            {time: 760, bpm: 77},
            {time: 6900, bpm: 144},
            {time: 11300, bpm: 77}
        ],
        notes: [
            {time: 1875, pads: [0,4], dragTime: 468.75},
            {time: 2500, pads: [3], dragTime: 3000}
        ]
    }
];