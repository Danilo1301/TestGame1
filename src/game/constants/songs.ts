export interface SongNote {
    time: number
    pads: number[]
}

export interface Song {
    name: string
    notes: SongNote[]
}

export const songs: Song[] = [
    {name: "Song 1", notes: [
        {time: 0, pads: [1]},
        {time: 467, pads: [1]},
        {time: 875, pads: [1]},
        {time: 1283, pads: [1]},
        {time: 1707, pads: [3]},
        {time: 2163, pads: [3]},
        {time: 2608, pads: [3]},
        {time: 2608, pads: [3]},
        {time: 3011, pads: [3]}
    ]}
];