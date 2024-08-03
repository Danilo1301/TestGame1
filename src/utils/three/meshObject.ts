import * as THREE from 'three';
import { GameScene } from '../../game/scenes/gameScene';
import Three from './three';
import { MainScene } from '../../game/scenes/mainScene';
import { DebugText } from '../debug/debugText';

export default class MeshObject
{
    public mesh: THREE.Mesh;
    public debugText: DebugText;
    public name: string = "Object";

    constructor(mesh: THREE.Mesh)
    {
        this.mesh = mesh;
        this.debugText = new DebugText("Object");
    }

    public update()
    {
        this.debugText.setLine("title", this.name);
        this.debugText.set3DPosition(this.mesh.position);
        this.debugText.update();
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

        this.debugText.destroy();
    }
}