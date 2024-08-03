import { BaseObject } from "../../utils/baseObject";
import MeshObject from "../../utils/three/meshObject";
import Three from "../../utils/three/three";
import { GameScene } from "../scenes/gameScene";
import { Note } from "./note";

export class Notes extends BaseObject
{
    public get notes() { return this._notes; };

    private _notes: Note[] = [];

    public spawnNoteForPad(padIndex: number)
    {
        const pad = GameScene.Instance.pads.getPad(padIndex);
        const position = pad.getPosition();

        this.spawnNote(position.x, position.y, position.z - 2);
    }

    public spawnNote(x: number, y: number, z: number)
    {
        const mesh = Three.createBox(0.1, 0.1, 0.1);
        mesh.position.set(x, y, z);

        const meshObject = Three.addMeshObject(mesh);
        meshObject.name = "Note";

        const note = new Note(meshObject);
    
        this._notes.push(note);

        return note;
    }

    public update()
    {
        const notesToDestroy: Note[] = [];

        for(const note of this._notes)
        {
            note.update();

            if(note.meshObject.mesh.position.z >= 2)
            {
                notesToDestroy.push(note);
            }
        }

        for(const note of notesToDestroy)
        {
            this._notes.splice(this._notes.indexOf(note), 1);

            note.destroy();
        }
    }
}