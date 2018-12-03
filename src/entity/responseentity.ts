import * as math from 'mathjs';
import { Urls } from './urls';
import Axios from 'axios';
import GenericID from './genericid';

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
    entity.items ? entity.items.forEach(item => {
      this.items.push(new ResponseEntity(item, patch, parameterData, false));
    }) : null;

    entity.replace ? entity.replace.forEach(x => {
      this.replace.push(new Replacement(x.from, x.to));
    }) : null;

    entity.value ? entity.value.forEach(x => this.value.push(x)) : null;

    this.returnType = entity.returnType || null;
    this.parameterData = parameterData as ParameterData;
    this.first = returnPatch;
    this.path = entity.path || '';
    this.patch = patch;
  }

  /**
   * Gets the response entity URL
   */
  async getUrl(): Promise<(string|string[])> {
    const path = await this.getPath();

    if (this.returnType === 'array') {
      if (!this.first) {
        throw new Error('configuration invalid, array can\'t be a starting value');
      } else {
        return path.map(pathOption => this.patch + pathOption);
      }
    }

    let url = `${this.first ? this.patch : ''}${path}`;

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
        const reqUrl = CDRAGON_RAW_BASE + this.patch + path;
        const reqData = (await Axios.get(reqUrl)).data;
        path = this.getValue(reqData, this.value.concat());
        break;
      case 'array':
        return Promise.all(
          this.items.map(async (item) => await item.getPath()),
        );
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

    this.parameterData.genericIds.forEach(genericId => {
      path = path.replace(`:${genericId.identifier}`, `${genericId.value}`);
    });

    return path;
  }

  /**
   * Fills the path with data
   */
  private fillString(path): string {
    let newPath = path
      .replace(':championKey', this.parameterData.championKey)
      .replace(':championId', `${this.parameterData.championId}`)
      .replace(':skinId', `${this.parameterData.skinId}`);

    this.parameterData.genericIds.forEach(genericId => {
      newPath = newPath.replace(':' + genericId.identifier, `${genericId.value}`);
    });

    return newPath;
  }

  /**
   * Traverses through a json to get the value
   *
   * @param json the requested JSON
   * @param arr values that traverse through the JSON
   */
  private getValue(json: any, arr: any[]) {
    let traversedJson = json;
    const node = arr[0];
    if (typeof node === 'object') {
      switch (Object.keys(node)[0]) {
        case 'searchFor':
          const value: string = this.generateValue(node.searchFor.value);
          const foundSegment = json.find(
            segment => segment[node.searchFor.key] === value,
          );
          traversedJson = foundSegment;
          break;
      }
    } else traversedJson = json[arr[0]];

    arr.shift();
    if (arr.length > 0) {
      return this.getValue(traversedJson, arr);
    } else {
      return traversedJson;
    }
  }

  /**
   * generates a search value for the mapper
   *
   * @param node
   */
  private generateValue(node: any) {
    let value: string = '';
    node.forEach(element => {
      switch (typeof element) {

        // add to string
        case 'string':
          value += element;
          break;

        // perform an action and add to string
        case 'object':
          switch (Object.keys(element)[0]) {

            // eval the string into a calculation
            case 'calc':
              value += math.eval(
                this.fillString(element.calc),
              );
              break;
          }
          break;
      }
    });
    return value;
  }

  /**
   * Changes the path with the replacement data
   *
   * @param {string} path the path that needs to be changed
   */
  private changePath(path: string) {
    path = path.toLocaleLowerCase();
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
  genericIds: GenericID[] = [];
  championKey: string = null;
  championId: number = null;
  skinId: number = null;
}