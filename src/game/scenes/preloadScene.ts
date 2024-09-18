import { Asset, AssetLoad, AssetType, LoadState } from "../../utils/assetLoad/assetLoad"
import { AudioManager } from "../../utils/audioManager/audioManager";

export class PreloadScene extends Phaser.Scene
{
    public onPreloadFinish?: Function;

    constructor()
    {
        super({});
    }

    public preload()
    {
        this.load.image("test", "/assets/test.png");
        this.load.image("background_load", "/assets/background/background_load.png");
        this.load.image("how_to_play", "/assets/background/how_to_play.png");
    }

    public async create()
    {
       this.onPreloadFinish?.();
    }

    public update(time: number, delta: number)
    {
        
    }
}