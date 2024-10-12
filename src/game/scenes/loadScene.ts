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
    public static Instance?: LoadScene;
    
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

            console.log("filecomplete", asset.path);

            self.printLoadState();
        });

        const gamesize = Gameface.Instance.getGameSize();

        //const bg = this.add.rectangle(0, 0, gamesize.x, gamesize.y, 0x000000);
        //bg.setOrigin(0, 0);

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
        let totalAssets = this.getNumberOfAssets();
        let loadedAssets = this.getNumberOfLoadedAssets();

        this.progressBar.setProgress(loadedAssets / totalAssets);
    }

    public getNumberOfLoadedAssets()
    {
        let loadedAssets = 0;
        for(const loadAsset of this._loadAssets)
        {
            if(loadAsset.asset.loadState == LoadState.LOADED) loadedAssets++;
        }
        return loadedAssets;
    }

    public getNumberOfAssets()
    {
        return this._loadAssets.length;
    }

    public loadAsset(asset: Asset)
    {
        console.log(`[LoadScene] add loadAsset image '${asset.key}'`);

        const loadAsset: LoadAsset = {
            text: `Loading image ${asset.key}`,
            asset: asset
        }
        this._loadAssets.push(loadAsset);
    }

    private printLoadState()
    {
        let totalAssets = this.getNumberOfAssets();
        let loadedAssets = this.getNumberOfLoadedAssets();

        console.log(`Loaded assets: ${loadedAssets} / ${totalAssets}`)
    }

    public async startLoadingAssets()
    {
        return new Promise<void>(async (resolve) => {

            const load = this.load;

            //

            console.log("loading tasks before assets...");
                
            await this.loadAllTasks(true);

            console.log("loading assets...");

            //

            for (const loadAsset of this._loadAssets)
            {
                if(loadAsset.asset.loadState == LoadState.LOADED) continue;

                const key = loadAsset.asset.key;
                const path = loadAsset.asset.path;

                loadAsset.asset.loadState = LoadState.LOADING;

                if(loadAsset.asset.type == AssetType.IMAGE) load.image(key, path);
                if(loadAsset.asset.type == AssetType.AUDIO)
                {
                    console.warn("Áudio não é suportado no IOS AINDA");
                    //load.audio(key, path, { noCache: true });
                }
                if(loadAsset.asset.type == AssetType.ATLAS) load.atlas(key, `${path}.png`, `${path}.json`);
            }

            //

            load.once('complete', async () => {

                console.log("load completed");

                for(const loadAsset of this._loadAssets)
                {
                    if(loadAsset.asset.loadState == LoadState.LOADED) continue;

                    console.log(loadAsset);

                }
                console.log("loading audios...");
                
                await AudioManager.loadAllAudios();

                console.log("loading tasks...");
                
                await this.loadAllTasks(false);

                resolve();
            });
            load.start();
        });
    }

    private async loadAllTasks(beforeLoad: boolean)
    {
        for (const loadAsset of this._loadAssets)
        {
            if(loadAsset.asset.loadState == LoadState.LOADED) continue;
            
            if(beforeLoad)
            {
                if(loadAsset.asset.type != AssetType.TASK_BEFORE_LOAD) continue;
            } else {
                if(loadAsset.asset.type != AssetType.TASK_AFTER_LOAD) continue;
            }

            this.printLoadState();

            loadAsset.asset.loadState = LoadState.LOADING;

            const key = loadAsset.asset.key;
            const fn = loadAsset.asset.fn;

            console.log(`Awaiting task ${key}`);

            if(fn)
                await fn();

            console.log(`Task ${key} finished`);

            loadAsset.asset.loadState = LoadState.LOADED;

            this.printLoadState();
        }
    }
}