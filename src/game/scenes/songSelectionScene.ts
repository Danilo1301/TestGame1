import { Debug } from "../../utils/debug/debug";
import { Button } from "../../utils/ui/button";
import { Song, songs } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { EditorScene } from "./editorScene";
import { GameScene } from "./gameScene/gameScene";

export class SongSelectionScene extends Phaser.Scene
{
    constructor()
    {
        super({});
    }

    public async create()
    {
        let y = 50;

        for(const song of songs)
        {
            const button = new Button(this, song.name, 200, y, 200, 50, "button");
            button.onClick = () => this.selectSong(song);

            const editor = new Button(this, "Edit", 400, y, 200, 50, "button");
            editor.onClick = () => this.editSong(song);

            y += 50;
        }

        //this.selectSong(songs[0]);
    }

    public selectSong(song: Song)
    {
        Gameface.Instance.sceneManager.startScene(GameScene);

        GameScene.Instance.startSong(song);

        Gameface.Instance.sceneManager.removeScene(SongSelectionScene);
    }

    public editSong(song: Song)
    {
        Gameface.Instance.sceneManager.startScene(EditorScene);
        EditorScene.Instance.setSong(song);

        Gameface.Instance.sceneManager.removeScene(SongSelectionScene);
    }

    public update(time: number, delta: number)
    {
        
    }
}