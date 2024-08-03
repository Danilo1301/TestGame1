import * as THREE from 'three';
import { GameScene } from '../../game/scenes/gameScene';
import Three from './three';

export default class MeshObject
{
    public mesh: THREE.Mesh;
    public text: Phaser.GameObjects.Text | undefined;
    public name: string = "Object";

    constructor(mesh: THREE.Mesh)
    {
        this.mesh = mesh;

        const scene = GameScene.Instance;

        this.text = scene.add.text(0, 0, '', { font: '16px Arial' });
    }

    public update()
    {
        const screenPosition = Three.convert3DPositionTo2D(this.mesh.position);

        const text = this.text;

        if(text)
        {
            //text.setText(`${this.name} (${screenPosition.x}, ${screenPosition.y})`);
            text.setText(`${this.name}`);
            text.setPosition(screenPosition.x, screenPosition.y);
        }
    }

    public destroy()
    {
        const mesh = this.mesh;

        Three.scene.remove(mesh);

        if (mesh.geometry) {
            mesh.geometry.dispose();
        }
    
        // Destrói o material
        if (mesh.material) {
            // Se o material for um array (ex: ao usar múltiplos materiais), destrua cada um
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else {
                mesh.material.dispose();
            }
        }
    
        // Destrói texturas associadas (se houver)
        /*
        if (mesh.material.map) {
            mesh.material.map.dispose();
        }
        */

        if(this.text)
        {
            this.text.destroy();
            this.text = undefined;
        }
    }
}