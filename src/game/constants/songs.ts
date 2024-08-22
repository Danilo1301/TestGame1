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

export const songs: Song[] = [
    {
        name: "Guns N' Roses - Sweet Child O' Mine",
        sound: "sound4",
        offset: 0,
        bpms: [
            {time: 70.50000000000027, bpm: 128},
            {time: 14714.09999999896, bpm: 128},
            {time: 30391.289, bpm: 128},
            {time: 44656.299000002655, bpm: 128},
        ],
        notes: [
            {time: 3820.5, pads: [1], dragTime: 0},
    {time: 4054.875, pads: [0], dragTime: 0},
    {time: 4289.25, pads: [1], dragTime: 0},
    {time: 4523.625, pads: [0], dragTime: 0},
    {time: 4758, pads: [1], dragTime: 468.75},
    {time: 5695.5, pads: [3], dragTime: 0},
    {time: 5929.875, pads: [4], dragTime: 0},
    {time: 6164.25, pads: [3], dragTime: 0},
    {time: 6398.625, pads: [4], dragTime: 0},
    {time: 6633, pads: [3], dragTime: 468.75},
    {time: 7570.5, pads: [3], dragTime: 0},
    {time: 7804.875, pads: [2], dragTime: 0},
    {time: 8508, pads: [0], dragTime: 468.75},
    {time: 8039.249, pads: [1], dragTime: 0},
    {time: 8273.624, pads: [2], dragTime: 0},
    {time: 9445.5, pads: [2], dragTime: 0},
    {time: 9679.875, pads: [1], dragTime: 0},
    {time: 9914.25, pads: [2], dragTime: 0},
    {time: 10148.625, pads: [3], dragTime: 0},
    {time: 10383, pads: [4], dragTime: 468.75},
    {time: 11320.5, pads: [0], dragTime: 0},
    {time: 11554.875, pads: [1], dragTime: 0},
    {time: 11789.25, pads: [2], dragTime: 0},
    {time: 12023.625, pads: [3], dragTime: 0},
    {time: 12258, pads: [4], dragTime: 0},
    {time: 12492.375, pads: [3], dragTime: 0},
    {time: 12726.75, pads: [4], dragTime: 0},
    {time: 13195.5, pads: [2], dragTime: 0},
    {time: 13664.25, pads: [2], dragTime: 0},
    {time: 14133, pads: [2], dragTime: 0},
    {time: 14601.75, pads: [2], dragTime: 0},
    {time: 15141.602, pads: [1,3], dragTime: 1681.8720000000012},
    {time: 17057.849000000002, pads: [2], dragTime: 1640.625},
    {time: 18932.849000000002, pads: [0,3], dragTime: 1640.625},
    {time: 20807.849000000002, pads: [3], dragTime: 0},
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