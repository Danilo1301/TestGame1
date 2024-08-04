import * as THREE from 'three';
import { MainScene } from "../../game/scenes/mainScene";
import Three from '../three/three';
import { GameScene } from '../../game/scenes/gameScene';

export class DebugText {
    public lines: Map<string, string> = new Map<string, string>();
    public text?: Phaser.GameObjects.Text;
    public position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    
    constructor(title: string)
    {
        const scene = MainScene.Instance;

        this.text = scene.add.text(0, 0, 'test', { font: '16px Arial' });
        scene.layerHud.add(this.text);

        console.log("text created")

        this.setLine("title", title);
    }

    public setLine(key: string, text: string)
    {
        this.lines.set(key, text);
    }

    public set3DPosition(position: THREE.Vector3)
    {
        const screenPosition = Three.convert3DPositionTo2D(position);
        this.position.x = screenPosition.x;
        this.position.y = screenPosition.y;
    }

    public update()
    {
        const text = this.text;

        
        if(text)
        {
            let str = "";
            for(const v of this.lines.values())
            {
                str += `${v}\n`;
            }

            //text.setText(`${this.name} (${screenPosition.x}, ${screenPosition.y})`);
            text.setText(str);
            text.setPosition(this.position.x, this.position.y);
            //text.setPosition(400, 300);
        }
        
    }

    public destroy()
    {
        if(this.text)
        {
            this.text.destroy();
            this.text = undefined;
        }
    }
}