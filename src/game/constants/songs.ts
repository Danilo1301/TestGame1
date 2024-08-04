export interface SongNote {
    time: number
    pads: number[]
}

export interface Song {
    name: string
    sound: string
    notes: SongNote[]
}

export const songs: Song[] = [
    {name: "Neovaii - Crash", sound: "sound1", notes: [
        {time: 0, pads: [1]},
        {time: 467, pads: [1]},
        {time: 875, pads: [1]},
        {time: 1283, pads: [1]},
        {time: 1707, pads: [3]},
        {time: 2163, pads: [3]},
        {time: 2608, pads: [3]},
        {time: 2608, pads: [3]},
        {time: 3011, pads: [3]}
    ]},
    {name: "NCS Faded", sound: "sound2", notes: [
        {time: 100, pads: [1]},
        {time: 460, pads: [2]},
        {time: 782, pads: [1]},
        {time: 1074, pads: [2]},
        {time: 1419, pads: [1]},
        {time: 1765, pads: [2]},
        {time: 2087, pads: [1]},
        {time: 2432, pads: [2]},
        {time: 2760, pads: [1]},
        {time: 3100, pads: [2]},
        {time: 3400, pads: [1]},
    ]}
];