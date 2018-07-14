import { Urls } from "./urls";
import Axios from "axios";

const CDRAGON_RAW_BASE = Urls.CDRAGON_RAW_BASE;

export class ResponseEntity {
    private parameterData: ParameterData;
    private items: ResponseEntity[] = [];
    private replace: Replacement[] = [];
    private returnType: string = null;
    private value: string[] = [];
    private path: string = '';
    private first: boolean;
    private patch: string;

    /**
     * Constructs a response entity
     * 
     * @param entity 
     * @param patch 
     * @param parameterData 
     * @param returnPatch 
     */
    constructor(entity: any, patch: string, parameterData: object, returnPatch: boolean = true) {
        entity.items? entity.items.forEach(item => {
            this.items.push(new ResponseEntity(item, patch, parameterData, false));
        }) : null;

        entity.replace ? entity.replace.forEach(x => {
            this.replace.push(new Replacement(x.from, x.to))
        }) : null;

        entity.value ? entity.value.forEach(x => this.value.push(x)) : null;

        this.returnType = entity.returnType||null;
        this.parameterData = <ParameterData> parameterData;
        this.first = returnPatch;
        this.path = entity.path||'';
        this.patch = patch;
    }

    /**
     * Gets the response entity URL
     */
    async getUrl(): Promise<string> {
        let path = await this.getPath();
        let url = `${this.first ? this.patch: ''}${path}`;
        
        for (let i = 0; i < this.items.length; i++) {
            url += await this.items[i].getUrl();            
        }

        return url;
    }

    /**
     * gets the proper path back
     */
    private async getPath() {
        let path = this.fillPath();

        switch (this.returnType) {
            case 'jsonData':
                let reqUrl = CDRAGON_RAW_BASE + this.patch + path;
                let reqData = (await Axios.get(reqUrl)).data;
                path = this.getValue(reqData, this.value.concat());
                break;
        }
        return this.changePath(path);
    }

    /** 
     * Fills the path with data
     */
    private fillPath(): string {
        let path = this.path
            .replace(':championKey', this.parameterData.championKey)
            .replace(':championId', `${this.parameterData.championId}`)
            .replace(':skinId', `${this.parameterData.skinId}`);
        return path;
    }

    /**
     * Traverses through a json to get the value
     * 
     * @param json the requested JSON
     * @param arr values that traverse through the JSON
     */
    private getValue(json: any, arr: string[]) {
        let traversedJson = json[arr[0]];
        arr.shift();
        if (arr.length > 0) {
            return this.getValue(traversedJson, arr);
        } else {
            return traversedJson;
        }
    }

    /**
     * Changes the path with the replacement data
     * 
     * @param {string} path the path that needs to be changed 
     */
    private changePath(path: string) {
        path = path.toLocaleLowerCase()
        this.replace.forEach(replacement => {
            path = path.replace(replacement.from, replacement.to);
        });

        return path;
    }
}

/** 
 * Holds data to replace parts of the path string with
 */
class Replacement {
    public from: string;
    public to: string;

    constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
    }
}

/** 
 * Holds the parameter data from the request url
 */
class ParameterData {
    genericIds: number[] = [];
    championKey: string = null;
    championId: number = null;
    skinId: number = null;
}