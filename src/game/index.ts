import { Debug } from "../utils/debug/debug";
import { Gameface } from "./gameface/gameface";

const gameface = new Gameface();

async function main()
{
    await gameface.start();

    Debug.log("index", "game started");
}

main();

const w: any = window;
w["gameface"] = gameface;
w["Debug"] = Debug;


