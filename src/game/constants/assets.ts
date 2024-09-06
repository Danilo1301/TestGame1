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
    {key: "grey_panel2", path: "uipack/grey_panel2.png"},
    {key: "hud/bg1", path: "hud/bg1.png"},
    {key: "hud/bg2", path: "hud/bg2.png"},
    {key: "hud/bg3", path: "hud/bg3.png"},
    {key: "hud/money", path: "hud/money.png"},
    {key: "guitars/guitar1", path: "guitars/guitar1.png"},

    {key: "progress_bar", path: "progress_bar.png"},
    {key: "progress_bar2", path: "progress_bar2.png"},
    {key: "progress_bar_mask", path: "progress_bar_mask.png"},
    {key: "progress_bar_bg", path: "progress_bar_bg.png"},
    {key: "progress_bar_bg2", path: "progress_bar_bg2.png"},

    {key: "song1_image", path: "songs/song1.png"} //test
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