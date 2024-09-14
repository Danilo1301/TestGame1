import { BaseObject } from "../utils/baseObject";
import { isNode } from "../utils/utils";
import { Song } from "./constants/songs";
import fs from "fs"
import path from "path"

export class SongManager extends BaseObject {
    private _songs = new Map<string, Song>();

    public getSong(id: string)
    {
        if(!this._songs.has(id))
        {
            throw `SongManager: Song ${id} not found`;
        }

        return this._songs.get(id)!;
    }

    public getSongs()
    {
        return Array.from(this._songs.values());
    }

    public async loadSong(id: string)
    {
        this.log("loading song " + id);

        if(this._songs.has(id))
        {
            this.log(`Song '${id}' was already loaded!`);
            return;
        }


        let song: Song | undefined = undefined;
        
        if(isNode())
        {
            const songPath = path.join(__dirname, "..", "..", "public", "assets", "songs");
            const jsonPath = path.join(songPath, `${id}.json`);

            this.log("song json:", jsonPath);

            if(fs.existsSync(jsonPath))
                song = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));  
        } else {
            song = await this.fetchSongJson(id);
        }

        if(!song)
        {
            throw `SongManager: Could not load song '${id}'`;
        }

        this._songs.set(id, song);

        this.log("Loaded song: '", song.name, "' as", id);
    }

    private fetchSongJson(songId: string)
    {
        return new Promise<undefined | Song>((resolve) => {
            // URL do endpoint de onde os dados JSON serão buscados
            const url = `/assets/songs/${songId}.json`;

            this.log("song url:", url);

            fetch(url)
            .then(response => {
                // Verifica se a resposta é bem-sucedida (status 200)
                if (!response.ok) {
                    resolve(undefined);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((json: Song) => {
                // Imprime os dados JSON recebidos no console
                console.log('Data received:', json);
                resolve(json);
            })
            .catch(error => {
                // Imprime erros de rede ou de parsing no console
                console.error('Error fetching data:', error);

                resolve(undefined);
            });
        });
    }
}