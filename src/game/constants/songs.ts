export interface SongNote {
    time: number
    pads: number[]
    dragTime: number
}

export interface Song {
    name: string
    sound: string
    notes: SongNote[]
}

export const songs: Song[] = [
    {name: "Neovaii - Crash", sound: "sound1", notes: [
        {time: 0, pads: [1], dragTime: 300},
        {time: 467, pads: [1], dragTime: 0},
        {time: 875, pads: [1], dragTime: 300},
        {time: 1283, pads: [1], dragTime: 0},
        {time: 1707, pads: [3], dragTime: 300},
        {time: 2163, pads: [3], dragTime: 0},
        {time: 2608, pads: [3], dragTime: 300},
        {time: 3011, pads: [3], dragTime: 0}
    ]},
    {name: "NCS Faded", sound: "sound2", notes: [
        {time: 100, pads: [1], dragTime: 0},
        {time: 460, pads: [2], dragTime: 0},
        {time: 782, pads: [1], dragTime: 0},
        {time: 1074, pads: [2], dragTime: 0},
        {time: 1419, pads: [1], dragTime: 0},
        {time: 1765, pads: [2], dragTime: 0},
        {time: 2087, pads: [1], dragTime: 0},
        {time: 2432, pads: [2], dragTime: 0},
        {time: 2760, pads: [1], dragTime: 0},
        {time: 3100, pads: [2], dragTime: 0},
        {time: 3400, pads: [1], dragTime: 0},
    ]},
    {name: "TAIGA - Ghostbusters", sound: "sound3", notes: [
        {time: 1000, pads: [1], dragTime: 1000},
        {time: 2100, pads: [1], dragTime: 0},
        {time: 2432, pads: [2], dragTime: 0},
        {time: 2760, pads: [1], dragTime: 0},
        {time: 3100, pads: [2], dragTime: 0},
        {time: 3400, pads: [1], dragTime: 0},
        {time: 4400, pads: [3], dragTime: 0},
        {time: 5400, pads: [3], dragTime: 0},
        {time: 6400, pads: [3], dragTime: 0},
    ]}
];