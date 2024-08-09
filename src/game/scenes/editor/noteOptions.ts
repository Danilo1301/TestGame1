import { Button } from "../../../utils/ui/button";
import { SongNote } from "../../constants/songs";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";
import { GameScene } from "../gameScene/gameScene";
import { MainScene } from "../mainScene";
import { EditorScene } from "./editorScene";

export class NoteOptions
{
    public container: Phaser.GameObjects.Container;
    public background: Phaser.GameObjects.Rectangle;

    public onClose?: Function;

    public note: SongNote;
   
    constructor(scene: Phaser.Scene, note: SongNote)
    {
        this.note = note;

        const gameSize = Gameface.Instance.getGameSize();

        this.container = scene.add.container(0, 0);
        this.container.setPosition(gameSize.x/2, gameSize.y/2);
        MainScene.Instance.layerHud.add(this.container);

        this.background = scene.add.rectangle(0, 0, 400, 400, 0xffffff);
        this.container.add(this.background);

        const deleteNote = Hud.addButton("Remove note", 0, -50, 150, 50, "button");
        deleteNote.onClick = () => {
            this.destroy();
            EditorScene.Instance.deleteNote(this.note);
            this.onClose?.();
        };
        this.container.add(deleteNote.container);

        const makeSlider = Hud.addButton("Make slider", 0, 0, 150, 50, "button");
        makeSlider.onClick = () => {
            this.destroy();
            EditorScene.Instance.makeNoteSlider(this.note);
            this.onClose?.();
        };
        this.container.add(makeSlider.container);

        const removeSlider = Hud.addButton("Remove slider", 0, 50, 150, 50, "button");
        removeSlider.onClick = () => {
            this.destroy();
            EditorScene.Instance.removeSlider(this.note);
            this.onClose?.();
        };
        this.container.add(removeSlider.container);

        const back = Hud.addButton("> Back", 0, 100, 150, 50, "button");
        back.onClick = () => {
            this.destroy();
            this.onClose?.();
        };
        this.container.add(back.container);
    }

    public destroy()
    {
        this.background.destroy();
        this.container.destroy();
        //this.addButton.destroy();
    }
}