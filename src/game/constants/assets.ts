interface AssetItem {
    key: string,
    path: string
}

export const imageAssets: AssetItem[] = [
    {key: "note", path: "note.png"},
    {key: "note_color", path: "note_color.png"},
    {key: "pad", path: "pad.png"},
    {key: "bpm_divisor", path: "bpm_divisor.png"},
    {key: "mask", path: "mask/mask.png"},
    {key: "mask_mobile", path: "mask/mask_mobile.png"},
    {key: "background1", path: "background/background1.png"},
    {key: "background1_mobile", path: "background/background1_mobile.png"},
    {key: "progress_bg", path: "progress_bg.png"},
    {key: "guitar_slot", path: "guitar_slot.png"},
    {key: "guitar_icon1", path: "guitar_icon1.png"},
    {key: "button", path: "button.png"},
    {key: "grey_panel2", path: "uipack/grey_panel2.png"}
];

export const audioAssets: AssetItem[] = [
    {key: "bpm", path: "bpm.ogg"},
    {key: "osu_hitsound", path: "osu_hitsound.ogg"},
    {key: "song1", path: "songs/song1.mp3"}
];

export const atlasAssets: AssetItem[] = [
    {key: "pad_sheet", path: "pad/sheet"},
    {key: "note_sheet", path: "note/sheet"}
];