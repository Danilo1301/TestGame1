import * as Phaser from "phaser"
import { MainScene } from "../../game/scenes/mainScene";
import { Gameface } from "../../game/gameface/gameface";
import { LoadScene } from "../../game/scenes/loadScene";
import { Debug } from "../debug/debug";
import { atlasAssets, audioAssets, imageAssets } from "../../game/constants/assets";
import { AudioManager } from "../audioManager/audioManager";

export enum LoadState {
    NOT_LOADED,
    LOADING,
    LOADED
}

export enum AssetType {
    IMAGE,
    AUDIO,
    FONT,
    ATLAS,
    TASK_BEFORE_LOAD,
    TASK_AFTER_LOAD,
}

export interface Asset {
    key: string
    path: string
    loadState: LoadState
    type: AssetType
    fn?: Function
}

export class AssetLoad
{
    private static _assets = new Phaser.Structs.Map<string, Asset>([]);

    public static addImage(key: string, path: string)
    {
        console.log(`Add asset to load: ${key} (${path})`);

        const asset: Asset = {
            key: key,
            path: path,
            loadState: LoadState.NOT_LOADED,
            type: AssetType.IMAGE
        }

        this._assets.set(key, asset);
    }
    
    public static addAudio(key: string, path: string)
    {
        console.log(`Add asset to load: ${key} (${path})`);

        const asset: Asset = {
            key: key,
            path: path,
            loadState: LoadState.NOT_LOADED,
            type: AssetType.AUDIO
        }

        this._assets.set(key, asset);
    }

    public static addAtlas(key: string, path: string)
    {
        console.log(`Add asset to load: ${key} (${path})`);

        const asset: Asset = {
            key: key,
            path: path,
            loadState: LoadState.NOT_LOADED,
            type: AssetType.ATLAS
        }

        this._assets.set(key, asset);
    }

    public static addTask(key: string, loadBefore: boolean, fn: Function)
    {
        console.log(`Add task ${key} to load`);

        const asset: Asset = {
            key: key,
            path: "",
            loadState: LoadState.NOT_LOADED,
            type: loadBefore ? AssetType.TASK_BEFORE_LOAD : AssetType.TASK_AFTER_LOAD,
            fn: fn
        }

        this._assets.set(key, asset);
    }

    public static addAssets()
    {
        this.addTask(`connect_server`, true, async () => {
            return new Promise<void>(async (resolve) => {
                
                console.log("connecting to server");

                await Gameface.Instance.network.connectAndWait();

                resolve();
            });
        });

        this.addTask(`load_songs`, true, async () => {
            return new Promise<void>(async (resolve) => {
                
                await Gameface.Instance.beginLoad1();

                console.log("loading songs");

                for(const song of Gameface.Instance.songManager.getSongs())
                {
                    const key = song.sound;
                    const path = `songs/${song.sound}.mp3`;
        
                    this.addAudio(key, path);
                    AudioManager.addAudio(key, path);
                }

                resolve();
            });
        });

        for(const asset of imageAssets)
        {
            this.addImage(asset.key, asset.path);
        }

        for(const asset of atlasAssets)
        {
            this.addAtlas(asset.key, asset.path);
        }
    
        for(const asset of audioAssets)
        {
            this.addAudio(asset.key, asset.path);
            AudioManager.addAudio(asset.key, asset.path);
        }
    }

    public static async load()
    {
        Debug.log("AssetLoad", "Loading assets...");

        const scene = Gameface.Instance.sceneManager.startScene(LoadScene) as LoadScene; 

        for(const asset of this._assets.values())
        {
            scene.loadAsset(asset);
        }

        await scene.startLoadingAssets();

        Gameface.Instance.sceneManager.removeScene(LoadScene);

        Debug.log("AssetLoad", "Assets loaded!");
    }

    public static getAssetsUrl() {
        return `${location.protocol}//${location.host}/assets/`;
    }

    public static getAssetByKey(key: string)
    {
        for(const asset of this._assets.values())
        {
            if(asset.key == key) return asset;
        }
        return undefined;
    }
}