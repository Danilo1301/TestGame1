import { Button } from "../../../utils/ui/button";
import { SongNote } from "../../constants/songs";
import { Gameface } from "../../gameface/gameface";
import { EditorScene } from "../editorScene";
import { GameScene } from "../gameScene/gameScene";
import { MainScene } from "../mainScene";

export class PadSelector
{
    public container: Phaser.GameObjects.Container;
    public image: Phaser.GameObjects.Image;
    public selected: boolean = false;

    constructor(scene: Phaser.Scene)
    {
        const container = scene.add.container(0, 0);
        this.container = container;

        const image = scene.add.image(0, 0, "note");
        this.image = image;

        container.add(image);

        const self = this;

        image.setInteractive(new Phaser.Geom.Rectangle(0, 0, 50, 50), Phaser.Geom.Rectangle.Contains);
        image.on('pointerdown', function(){
            self.selected = !self.selected;
            self.updateImage();
        }, this);

        this.updateImage();
    }

    public updateImage()
    {
        this.image.tint = this.selected ? 0xffffff : 0x0;
    }
}

/*
TODO: destroy padselector
*/

export class AddNote
{
    public padSelectors: PadSelector[] = [];

    public container: Phaser.GameObjects.Container;
    public background: Phaser.GameObjects.Rectangle;
    public addButton: Button;

    constructor(scene: Phaser.Scene)
    {
        const gameSize = Gameface.Instance.getGameSize();

        this.container = scene.add.container(0, 0);
        this.container.setPosition(gameSize.x/2, gameSize.y/2);
        MainScene.Instance.layerHud.add(this.container);

        this.background = scene.add.rectangle(0, 0, 400, 400, 0xff0000);
        this.container.add(this.background);

        for(let i = 0; i < 5; i++)
        {
            const padSelector = new PadSelector(scene);

            this.container.add(padSelector.container);
            padSelector.container.setPosition(i * 60, 0);
            this.padSelectors.push(padSelector);
        }

        this.addButton = new Button(scene, "Add", 0, 200, 80, 50, "button");
        this.addButton.onClick = () => {
            console.log("add")

            const song = EditorScene.Instance.song!;

            const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();

            const pads: number[] = [];
            for(const pad of this.padSelectors)
            {
                if(pad.selected)
                {
                    const index = this.padSelectors.indexOf(pad);
                    pads.push(index);
                }
            }

            const songNote: SongNote = {
                time: time,
                pads: pads,
                dragTime: 0
            };

            song.notes.push(songNote);

            GameScene.Instance.soundPlayer.recreateNotes();

            this.destroy();
        };
        this.container.add(this.addButton.container);
    }

    public destroy()
    {
        this.background.destroy();
        this.container.destroy();
        this.addButton.destroy();
    }
}