import * as Phaser from "phaser"
import { Debug } from "../utils/debug/debug";
import { Gameface } from "./gameface/gameface";
import { GameScene } from "./scenes/gameScene/gameScene";
import { ThreeScene } from "../utils/three/threeScene";
import { EditorScene } from "./scenes/editor/editorScene";
import { SoundPlayer } from "./scenes/gameScene/soundPlayer";

const gameface = new Gameface();

async function main()
{
    await gameface.start();

    Debug.log("index", "game started");
}

window.addEventListener('load', () => main());

const w: any = window;
w["gameface"] = gameface;
w["Debug"] = Debug;
w["GameScene"] = GameScene;
w["ThreeScene"] = ThreeScene;
w["EditorScene"] = EditorScene;
w["SoundPlayer"] = SoundPlayer;


