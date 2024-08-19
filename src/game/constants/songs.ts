export interface SongNote {
    time: number
    pads: number[]
    dragTime: number
}

export interface Song {
    name: string
    sound: string
    bpm: number
    offset: number
    notes: SongNote[]
}

/*
* Find BPM: https://tunebat.com/Analyzer
*/

export const songs: Song[] = [
    {name: "TAIGA - Ghostbusters", sound: "sound3", bpm: 128, offset: 15, notes: [
        {time: 1875, pads: [0,4], dragTime: 468.75},
        {time: 3750, pads: [0,4], dragTime: 0},
        {time: 2812.5, pads: [3], dragTime: 0},
        {time: 3281.25, pads: [1], dragTime: 0},
        {time: 7031.25, pads: [2], dragTime: 0},
        {time: 6796.875, pads: [2], dragTime: 0},
        {time: 4218.75, pads: [1], dragTime: 0},
        {time: 4687.5, pads: [3], dragTime: 0},
        {time: 5156.25, pads: [1], dragTime: 0},
        {time: 6093.75, pads: [2], dragTime: 0},
        {time: 6562.5, pads: [2], dragTime: 0},
        {time: 5625, pads: [1,3], dragTime: 0},
        {time: 7500, pads: [1,3], dragTime: 0},
        {time: 9375, pads: [2], dragTime: 0},
        {time: 7968.75, pads: [3], dragTime: 0},
        {time: 8437.5, pads: [3], dragTime: 0},
        {time: 8906.25, pads: [1], dragTime: 0},
        {time: 9843.75, pads: [0], dragTime: 0},
        {time: 10312.5, pads: [1], dragTime: 0},
        {time: 10781.25, pads: [2], dragTime: 0},
        {time: 11250, pads: [1,3], dragTime: 0},
        {time: 11718.75, pads: [3], dragTime: 0},
        {time: 12187.5, pads: [4], dragTime: 0},
        {time: 12656.25, pads: [3], dragTime: 0},
        {time: 13125, pads: [1,3], dragTime: 0},
        {time: 13593.75, pads: [2], dragTime: 0},
        {time: 13828.125, pads: [2], dragTime: 0},
        {time: 14062.5, pads: [2], dragTime: 0},
        {time: 14531.25, pads: [2], dragTime: 0},
        {time: 15000, pads: [0,2], dragTime: 0},
        {time: 15937.5, pads: [2], dragTime: 0},
    ]},
    {name: "TAIGA - Ghostbusters 2", sound: "sound3", bpm: 128, offset: 15, notes: [
        {time: 1875, pads: [0,4], dragTime: 468.75},
        {time: 2500, pads: [3], dragTime: 3000}
    ]},
    {name: "Neovaii - Crash", sound: "sound1", bpm: 100, offset: 0, notes: [
        {time: 0, pads: [1], dragTime: 300},
        {time: 467, pads: [1], dragTime: 0},
        {time: 875, pads: [1], dragTime: 300},
        {time: 1283, pads: [1], dragTime: 0},
        {time: 1707, pads: [3], dragTime: 300},
        {time: 2163, pads: [3], dragTime: 0},
        {time: 2608, pads: [3], dragTime: 300},
        {time: 3011, pads: [3], dragTime: 0},
        {time: 4000, pads: [1], dragTime: 6000}
    ]},
    {name: "NCS Faded", sound: "sound2", bpm: 100, offset: 0, notes: [
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
    ]}
];