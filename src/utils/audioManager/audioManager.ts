import { Gameface } from "../../game/gameface/gameface";
import { MainScene } from "../../game/scenes/mainScene";
import { AssetLoad, LoadState } from "../assetLoad/assetLoad";

export interface AssetAudio
{
    key: string
    url: string
    audio?: HTMLAudioElement
    loadState: LoadState

}

export class AudioManager
{
    public static assets = new Map<string, AssetAudio>();
    public static onLoadedAllAudios?: Function;
    
    public static get sound() {
        const w: any = window;
        return w["createjs"].Sound as createjs.Sound;
    };

    public static addAudio(key: string, url: string)
    {
        console.log("add audio", url);

        const asset: AssetAudio = {
            key: key,
            url: url,
            audio: undefined,
            loadState: LoadState.LOADING
        }

        this.assets.set(key, asset);
    }

    public static playAudio(key: string)
    {
        return this.playAudioWithVolume(key, 1.0);
    }

    public static playAudioPhaser(key: string)
    {
        this.playAudioPhaserWithVolume(key, 1.0);
    }

    public static playAudioPhaserWithVolume(key: string, volume: number)
    {
        MainScene.Instance.sound.play(key, {volume: volume});
    }

    public static playAudioWithVolume(key: string, volume: number)
    {
        const asset = this.assets.get(key);
        
        if(!asset) throw "Asset " + key + " not found";

        const audio = asset.audio;

        if(!audio) throw "Audio not found";

        audio.volume = volume;
        audio.play();

        return audio;
    }

    public static async loadAllAudios()
    {
        return new Promise<void>((resolve) => {
            let notLoaded = this.getNotLoadedCount();

            for(const asset of this.assets.values())
            {
                console.log(`Loading html audio ${asset.url}`);

                const audio = new Audio(`/assets/${asset.url}`);
                //audio.preload = 'auto';

                asset.audio = audio;

                const self = this;

                function markAsLoaded()
                {
                    if(asset.loadState == LoadState.LOADED)
                    {
                        console.error("O audio já foi carregado, mas foi marcado como carregado novamente!");
                        return;
                    }

                    asset.loadState = LoadState.LOADED;

                    console.log(`Áudio HTML '${asset.url}' carregado!`);

                    notLoaded = self.getNotLoadedCount();

                    if(notLoaded == 0)
                    {
                        resolve();
                    }
                }

                audio.addEventListener('progress', () => {
                    console.log('Carregando áudio:', audio.readyState); 

                    markAsLoaded();
                    
                    if (audio.readyState >= 2)
                    {
                        console.log('Áudio pronto para reprodução: readyState = ' + audio.readyState);
                        markAsLoaded();
                    }
                });

                audio.addEventListener('canplaythrough', () => {
                    console.log('Áudio pronto para reprodução: canplaythrough');
                    markAsLoaded();
                }, false);
            }
        });
    }

    public static getNotLoadedCount()
    {
        let i = 0;
        for(const asset of this.assets.values())
        {
            if(asset.loadState == LoadState.LOADING) i++;
        }
        return i;
    }
}