import { Asset, AssetLoad, AssetType, LoadState } from "../../utils/assetLoad/assetLoad"
import { AudioManager } from "../../utils/audioManager/audioManager";
import { ProgressBar } from "../../utils/ui/progressBar";
import { Gameface } from "../gameface/gameface";

interface LoadAsset {
    text: string
    asset: Asset
    taskFn?: () => Promise<void>
}

export class LoadScene extends Phaser.Scene
{
    public static Instance: LoadScene;
    
    private _loadAssets: LoadAsset[] = [];

    public progressBar!: ProgressBar;

    constructor()
    {
        super({});

        LoadScene.Instance = this;
    }

    public async create()
    {
        const self = this;
        const load = this.load;

        load.setPath(AssetLoad.getAssetsUrl());
        load.on('filecomplete', function(key: string, type: any, data: any) {
            const asset = AssetLoad.getAssetByKey(key);

            if(!asset) return;

            asset.loadState = LoadState.LOADED;

            console.log("filecomplete", asset);
        });

        const gamesize = Gameface.Instance.getGameSize();

        const bg = this.add.rectangle(0, 0, gamesize.x, gamesize.y, 0x000000);
        bg.setOrigin(0, 0);

        const progressBar = new ProgressBar(this, gamesize.x - 50, 30);
        progressBar.setProgress(0);
        progressBar.setProgressColor(0xFFAC00);
        progressBar.setRestColor(0xffffff);
        progressBar.container.setPosition(gamesize.x/2, gamesize.y - 40);
        this.progressBar = progressBar;

        const mobileText = this.add.text(0, 0, Gameface.isMobile ? "Mobile" : "Desktop");
        mobileText.setFontFamily('Arial');
        mobileText.setOrigin(0);
    }

    public update(time: number, delta: number)
    {
        let totalAssets = 0;
        let loadedAssets = 0;
        for(const loadAsset of this._loadAssets)
        {
            totalAssets++;
            if(loadAsset.asset.loadState == LoadState.LOADED) loadedAssets++;
        }

        this.progressBar.setProgress(loadedAssets / totalAssets);
    }

    public loadAsset(asset: Asset)
    {
        console.log(`[loader] add load image '${asset.key}'`);

        const loadAsset: LoadAsset = {
            text: `Loading image ${asset.key}`,
            asset: asset
        }
        this._loadAssets.push(loadAsset);
    }

    public async startLoadingAssets()
    {
        return new Promise<void>((resolve) => {

            const load = this.load;

            for (const loadAsset of this._loadAssets)
            {
                const key = loadAsset.asset.key;
                const path = loadAsset.asset.path;

                loadAsset.asset.loadState = LoadState.LOADING;

                if(loadAsset.asset.type == AssetType.IMAGE) load.image(key, path);
                if(loadAsset.asset.type == AssetType.AUDIO) load.audio(key, path);
                if(loadAsset.asset.type == AssetType.ATLAS) load.atlas(key, `${path}.png`, `${path}.json`);
            }

            load.once('complete', async () => {

                console.log("load completed");
                console.log("loading audios...");
                
                await AudioManager.loadAllAudios();

                resolve();
            });
            load.start();
        });
    }
}