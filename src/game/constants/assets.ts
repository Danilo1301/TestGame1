interface AssetItem {
    key: string,
    path: string
}

export const imageAssets: AssetItem[] = [
    {key: "note", path: "note.png"},
    {key: "pad", path: "pad.png"},
    {key: "bpm_divisor", path: "bpm_divisor.png"},
    {key: "mask", path: "mask.png"},
    {key: "background", path: "background.png"},
];

export const audioAssets: AssetItem[] = [
    {key: "sound1", path: "sound1.mp3"},
    {key: "sound2", path: "sound2.mp3"},
    {key: "sound3", path: "sound3.mp3"},
    {key: "bpm", path: "bpm.ogg"},
    {key: "osu_hitsound", path: "osu_hitsound.ogg"},
];