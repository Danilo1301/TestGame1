interface AssetItem {
    key: string,
    path: string
}

export const imageAssets: AssetItem[] = [
    {key: "note", path: "note.png"},
    {key: "note_color", path: "note_color.png"},
    {key: "pad", path: "pad.png"},
    {key: "bpm_divisor", path: "bpm_divisor.png"},
    {key: "mask", path: "mask.png"},
    {key: "background", path: "background.png"},
    {key: "progress_bg", path: "progress_bg.png"},
    {key: "guitar_slot", path: "guitar_slot.png"},
    {key: "guitar_icon1", path: "guitar_icon1.png"},
    {key: "button", path: "button.png"},

];

export const audioAssets: AssetItem[] = [
    {key: "sound1", path: "sound1.mp3"},
    {key: "sound2", path: "sound2.mp3"},
    {key: "sound3", path: "sound3.mp3"},
    {key: "sound4", path: "sound4.mp3"},
    {key: "sound5", path: "sound5.mp3"},
    {key: "sound6", path: "sound6.mp3"},
    {key: "bpm", path: "bpm.ogg"},
    {key: "osu_hitsound", path: "osu_hitsound.ogg"},
];

export const atlasAssets: AssetItem[] = [
    {key: "pad_sheet", path: "pad/sheet"},
    {key: "note_sheet", path: "note/sheet"}
];