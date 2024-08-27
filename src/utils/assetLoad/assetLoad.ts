import * as Phaser from "phaser"
import { MainScene } from "../../game/scenes/mainScene";
import { Gameface } from "../../game/gameface/gameface";
import { LoadScene } from "../../game/scenes/loadScene";
import { Debug } from "../debug/debug";
import { atlasAssets, audioAssets, imageAssets } from "../../game/constants/assets";
import { AudioManager } from "../audioManager/audioManager";
import { Song, songIds, songs } from "../../game/constants/songs";

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

        for(const songId of songIds)
        {
            this.addTask(`load_song_${songId}`, true, async () => {
                return new Promise<void>((resolve)=> {
                    
                    // URL do endpoint de onde os dados JSON serão buscados
                    const url = `/assets/songs/${songId}.json`;

                    fetch(url)
                    .then(response => {
                        // Verifica se a resposta é bem-sucedida (status 200)
                        if (!response.ok) {
                            resolve();
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((json: Song) => {
                        // Imprime os dados JSON recebidos no console
                        console.log('Data received:', json);

                        songs.unshift(json);

                        resolve();
                    })
                    .catch(error => {
                        // Imprime erros de rede ou de parsing no console
                        console.error('Error fetching data:', error);

                        resolve();
                    });
                });
            });
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
        const serverAddress = "https://guitargame.glitch.me";

        if(location.host.includes('localhost') || location.host.includes(':')) {
            return `${location.protocol}//${location.host}/assets/`;
        } 

        return `${serverAddress}/assets/`;
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