import * as Phaser from "phaser"
import { Debug } from "../utils/debug/debug";
import { Gameface } from "./gameface/gameface";
import { GameScene } from "./scenes/gameScene/gameScene";
import { ThreeScene } from "../utils/three/threeScene";
import { EditorScene } from "./scenes/editor/editorScene";
import { SoundPlayer } from "./scenes/gameScene/soundPlayer";
import { MainScene } from "./scenes/mainScene";
import { gameSettings } from "./constants/gameSettings";

const gameface = new Gameface();

async function main()
{
    await gameface.start();
}

window.addEventListener('load', () => main());

window.game = {};
window.game.toggleFullscreen = () => { Gameface.Instance.toggleFullscreen() };
window.game.showFPS = () => { MainScene.Instance.toggleShowFPS(); }
window.game.setMoney = (amount?: number) => {
    if(amount === undefined) throw "Invalid amount";
    Gameface.Instance.gameLogic.money = amount;
}
window.game.hardMode = () => {
    gameSettings.noteTimeToAchieve = 500;
    alert("Modo hard ativado!");
}

if(gameSettings.exposeVars)
{
    const w: any = window;
    w["gameface"] = gameface;
    w["GameScene"] = GameScene;
    w["Debug"] = Debug;
    w["ThreeScene"] = ThreeScene;
    w["EditorScene"] = EditorScene;
    w["SoundPlayer"] = SoundPlayer;
}