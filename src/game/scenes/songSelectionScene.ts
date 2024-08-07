import { Debug } from "../../utils/debug/debug";
import { Button } from "../../utils/ui/button";
import { Song, songs } from "../constants/songs";
import { Gameface } from "../gameface/gameface";
import { AudioTestScene } from "./audioTestScene";
import { EditorScene } from "./editor/editorScene";
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
        let x = 300;

        for(const song of songs)
        {
            const button = new Button(this, song.name, x, y, 200, 50, "button");
            //button.container.alpha = 0.5;
            button.onClick = () => this.selectSong(song);

            const editor = new Button(this, "Edit", x + 200, y, 200, 50, "button");
            editor.onClick = () => this.editSong(song);

            y += 50;
        }

        const testAudio = new Button(this, "Audio test", 50, 50, 100, 50, "button");
        testAudio.onClick = () => {

            Gameface.Instance.sceneManager.startScene(AudioTestScene);

            Gameface.Instance.sceneManager.removeScene(SongSelectionScene);

        };

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