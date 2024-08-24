import { isNumberBetweenInverval } from "../../../utils/interval";
import { Button } from "../../../utils/ui/button";
import { NumberRange } from "../../../utils/ui/numberRange";
import { BPMChange, SongNote } from "../../constants/songs";
import { Gameface } from "../../gameface/gameface";
import { Hud } from "../../hud/hud";
import { GameScene } from "../gameScene/gameScene";
import { MainScene } from "../mainScene";
import { EditorScene } from "./editorScene";

export class BPMEditPanel
{
    public container: Phaser.GameObjects.Container;
    public background: Phaser.GameObjects.Rectangle;

    public onClose?: Function;

    public timeRange: NumberRange;

    constructor(scene: Phaser.Scene, bpmChange: BPMChange)
    {
        const gameSize = Gameface.Instance.getGameSize();

        const container = scene.add.container(0, 0);
        container.setPosition(gameSize.x/2, gameSize.y/2);
        Hud.addToHudLayer(container);
        this.container = container;

        this.background = scene.add.rectangle(0, 0, 600, 400, 0xffffff);
        this.background.setAlpha(0.5);
        this.container.add(this.background);
        
        const bpmText = scene.add.text(0, -100, `BPM: ${bpmChange.bpm}`);
        bpmText.setFontFamily('Arial');
        bpmText.setFontSize(20);
        bpmText.setColor('#FFFFFF');
        bpmText.setOrigin(0.5);
        bpmText.setStroke('#000000', 4);
        container.add(bpmText);

        const setBPM = new Button(scene, "set BPM", 200, -100, 150, 30, "button");
        setBPM.onClick = () => {
            const bpm = prompt("BPM") || "100";

            bpmChange.bpm = parseInt(bpm);
            bpmText.setText(`BPM: ${bpm}`)
        };
        container.add(setBPM.container);

        const closeButton = new Button(scene, "Close", 300, 200, 150, 50, "button");
        closeButton.onClick = () => {
            this.destroy();
            this.onClose?.();
        };
        container.add(closeButton.container);

        const deleteButton = new Button(scene, "Delete", 0, 100, 150, 50, "button");
        deleteButton.onClick = () => {

            const song = EditorScene.Instance.song!;

            song.bpms.splice(song.bpms.indexOf(bpmChange), 1);

            this.destroy();
            this.onClose?.();
        };
        container.add(deleteButton.container);

        const timeRange = new NumberRange(scene, 200);
        this.timeRange = timeRange;
        this.timeRange.addBy = 0.5;
        this.timeRange.value = bpmChange.time;
        this.timeRange.onValueChange = () => {

            const diff = this.timeRange.value - bpmChange.time;

            const bpmChangeInterval = EditorScene.Instance.bpmMeter.getBPMChangeInterval(bpmChange);

            bpmChange.time = this.timeRange.value;

            for(const note of EditorScene.Instance.song!.notes)
            {
                if(!isNumberBetweenInverval(note.time, bpmChangeInterval)) continue;

                note.time += diff;
            }
        };
        container.add(timeRange.container);
        
        setInterval(() => {
            this.timeRange.update();
        }, 10);
    }

    public destroy()
    {
        this.background.destroy();
        this.container.destroy();
    }
}

export class BPMChangeItem {

    public container: Phaser.GameObjects.Container;

    public rectBackground: Phaser.GameObjects.Rectangle;

    private _bpmChange: BPMChange;

    public onEdit?: Function;

    constructor(scene: Phaser.Scene, bpmChange: BPMChange)
    {
        this._bpmChange = bpmChange;

        const container = scene.add.container();
        this.container = container;

        const rect = scene.add.rectangle(0, 0, 400, 30, 0xffffff);
        this.rectBackground = rect;
        container.add(rect);

        const text = scene.add.text(0, 0, `time: ${bpmChange.time.toFixed(1)} | BPM: ${bpmChange.bpm}`);
        text.setColor("#000000");
        text.setOrigin(0, 0.5);
        text.setPosition(-150, 0);
        container.add(text);

        const edit = new Button(scene, "Edit", -200, 0, 100, 30, "button");
        edit.onClick = () => {
            const editPanel = new BPMEditPanel(scene, bpmChange);
            this.destroy();
            this.onEdit?.();
        };
        container.add(edit.container);
    }

    public update()
    {
        const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();
        const currentBpmChange = EditorScene.Instance.bpmMeter.getBPMChangeOfTime(time);

        const bgColor = currentBpmChange == this._bpmChange ? 0xff0000 : 0xffffff;

        this.rectBackground.fillColor = bgColor;
    }

    public destroy()
    {

    }
}

export class BPMOffsetsPanel
{
    public container: Phaser.GameObjects.Container;
    public background: Phaser.GameObjects.Rectangle;

    public onClose?: Function;

    public bpmChangeItems: BPMChangeItem[] = [];

    constructor(scene: Phaser.Scene)
    {
        const gameSize = Gameface.Instance.getGameSize();

        this.container = scene.add.container(0, 0);
        this.container.setPosition(gameSize.x/2, gameSize.y/2);
        MainScene.Instance.layerHud.add(this.container);

        this.background = scene.add.rectangle(0, 0, 600, gameSize.y, 0xffffff);
        this.container.add(this.background);

        const addButton = new Button(scene, "Add bpm change", 300, 0, 150, 50, "button");
        addButton.onClick = () => {
            console.log("add")

            const time = GameScene.Instance.soundPlayer.getCurrentSoundPosition();

            const bpmChange: BPMChange = {
                time: time,
                bpm: 120
            }

            EditorScene.Instance.song!.bpms.push(bpmChange);
            EditorScene.Instance.song!.bpms = EditorScene.Instance.song!.bpms.sort((a, b) => {
                return a.time - b.time
            });

            this.destroy();
            this.onClose?.();
        };
        this.container.add(addButton.container);

        const closeButton = new Button(scene, "Close", 300, 50, 150, 50, "button");
        closeButton.onClick = () => {
            this.destroy();
            this.onClose?.();
        };
        this.container.add(closeButton.container);

        this.createBPMChanges();
    }

    public createBPMChanges()
    {
        const scene = EditorScene.Instance;

        const gameSize = Gameface.Instance.getGameSize();

        let y = -gameSize.y/2 + 50;

        for(const bpmChange of EditorScene.Instance.song!.bpms)
        {
            const bpmChangeItem = new BPMChangeItem(scene, bpmChange);
            bpmChangeItem.container.setPosition(0, y);
            bpmChangeItem.onEdit = () => {
                this.destroy();
            };
            this.container.add(bpmChangeItem.container);
         
            this.bpmChangeItems.push(bpmChangeItem);

            y += 30;
        }
    }

    public destroy()
    {
        this.background.destroy();
        this.container.destroy();
    }

    public update()
    {
        for(const bpmChangeItem of this.bpmChangeItems)
        {
            bpmChangeItem.update();
        }
    }
}