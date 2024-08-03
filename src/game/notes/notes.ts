import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { GameScene } from "../scenes/gameScene";

export class Notes extends BaseObject
{
    private _noteMeshObjects: MeshObject[] = [];

    public spawnNoteForPad(padIndex: number)
    {
        const pad = GameScene.Instance.pads.getPad(padIndex);
        const position = pad.getPosition();

        this.spawnNote(position.x, position.y, position.z - 2);
    }

    public spawnNote(x: number, y: number, z: number)
    {
        const mesh = Three.createBox(0.1, 0.1, 0.1);
        const meshObject = Three.addMeshObject(mesh);
        meshObject.name = "Note";
        
        mesh.position.set(x, y, z);

        this._noteMeshObjects.push(meshObject);
    }

    public update()
    {
        const meshObjectsToDestroy: MeshObject[] = [];

        for(const meshObject of this._noteMeshObjects)
        {
            const mesh = meshObject.mesh;

            mesh.position.z += 0.03;

            if(mesh.position.z >= 2)
            {
                meshObjectsToDestroy.push(meshObject);
                continue;
            }
        }

        for(const meshObject of meshObjectsToDestroy)
        {
            this._noteMeshObjects.splice(this._noteMeshObjects.indexOf(meshObject), 1);

            meshObject.destroy();
        }
    }
}