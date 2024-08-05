interface AssetItem {
    key: string,
    path: string
}

export const imageAssets: AssetItem[] = [
    {key: "note", path: "note.png"},
    {key: "pad", path: "pad.png"}
];

export const audioAssets: AssetItem[] = [
    {key: "sound1", path: "sound1.mp3"},
    {key: "sound2", path: "sound2.mp3"},
    {key: "sound3", path: "sound3.mp3"}
];