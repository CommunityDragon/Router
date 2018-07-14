import { Urls } from './urls'
import axios from 'axios';
import Patch from './patch';

const CDRAGON_RAW_BASE = Urls.CDRAGON_RAW_BASE;
const { watch, unwatch } = require("watchjs");

const urlBase: string = CDRAGON_RAW_BASE;
const summaryLink = '/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
const skinLink = '/plugins/rcp-be-lol-game-data/global/default/v1/champions/';

export default class CDragon {

  private static instance: CDragon;

  /** duration of cache */
  private duration = {
    champions: 1000 * 3600
  };

  /** epoch time of initialization of request */
  private initialized = {
    champions: {}
  };

  private caching = {
    champions: {}
  };

  /** stores the cache of the request */
  private cache = {
    champions: {}
  };

  private constructor() { }

  static getInstance() {
    if (!CDragon.instance) {
      CDragon.instance = new CDragon();
    }
    return CDragon.instance;
  }

  /**
   * gets the cdragon patch
   *
   * @param ddragonPatch
   */
  getCDragonPatch(ddragonPatch: string) {
    return (ddragonPatch.split('.', 2)).join('.');
  }

  /**
   * Get Raw CDragon Champions
   */
  async getChampions(patch: Patch): Promise<any[]> {
    try {
      let cdragonPatch = patch.getCDragonPatch();
      let { cache, initialized, duration } = this.getCacheStats(cdragonPatch);

      if (cache.length == 0 || initialized + duration < new Date().getTime()) {
        if (this.caching.champions[cdragonPatch]) {
          await this.watchChampions(cdragonPatch);
        } else {
          this.caching.champions[cdragonPatch] = true;
          let champions = await this.getProcessedChampions(cdragonPatch);
          this.cache.champions[cdragonPatch] = await Promise.all(champions);
          this.setChampionsInitialized(cdragonPatch);
          this.caching.champions[cdragonPatch] = false;
        }
      }

      return this.cache.champions[cdragonPatch];
    } catch(e) {
      console.debug(e);
      return [];
    }
  }

  /**
   * watches for an update in champions
   *
   * @param cdragonPatch
   */
  private watchChampions(cdragonPatch: any) {
    return new Promise((resolve) => {
      let caching = this.caching;
      watch(caching.champions, cdragonPatch, function() {
        if (!caching.champions[cdragonPatch]) {
          unwatch(caching.champions, cdragonPatch);
          resolve();
        }
      })
    })
  }

  /**
   * sets the champions of the patch as initialized
   *
   * @param cdragonPatch
   */
  private setChampionsInitialized(cdragonPatch: string) {
    this.initialized.champions[cdragonPatch] = new Date().getTime();
  }

  /**
   * gets the raw champion data
   *
   * @param cdragonPatch
   */
  private async getRawChampions(cdragonPatch: string) {
    return (await axios.get(urlBase + cdragonPatch + summaryLink)).data;
  }

  /**
   * gets the processed champion data
   *
   * @param cdragonPatch
   */
  private async getProcessedChampions(cdragonPatch: string) {
    let champions = await this.getRawChampions(cdragonPatch);

    let filteredChamps = champions.filter((champion) => {
      return (champion.id >= 1);
    });

    return champions.map(async (champion) => {
      let { id, name, alias, roles } = champion;
      let skins = await this.getProcessedSkins(cdragonPatch, id);

      return { id, name, key: alias, roles, skins };
    })
  }

  /**
   * gets the processed skins
   *
   * @param cdragonPatch
   * @param id
   */
  private async getProcessedSkins(cdragonPatch: string, id: any) {
    let skins = await this.getRawSkins(cdragonPatch, id);
    return this.sanitizeSkins(skins, id);
  }

  /**
   * gets the raw skin data
   *
   * @param cdragonPatch
   * @param id
   */
  private async getRawSkins(cdragonPatch: string, id: any) {
    return (await axios.get(urlBase + cdragonPatch + skinLink + id + '.json')).data.skins;
  }

  /**
   * sanitizes skins
   *
   * @param skins
   * @param id
   */
  private sanitizeSkins(skins: any, id: any): any {
    return skins.map((skin) => {
      let { id: skinId, name: skinName, skinLines } = skin;
      skinId -= id * 1000;
      skinLines = !skinLines ? [] : skinLines.map((x) => x.id);
      return { id: skinId, name: skinName, skinLines };
    });
  }

  /**
   * returns the cache configuration data
   *
   * @param cdragonPatch
   */
  private getCacheStats(cdragonPatch: string) {
    !this.initialized.champions[cdragonPatch]
      ? this.initialized.champions[cdragonPatch] = 0 : null;
    !this.cache.champions[cdragonPatch]
      ? this.cache.champions[cdragonPatch] = [] : null;

    let initialized = this.initialized.champions[cdragonPatch];
    let cache = this.cache.champions[cdragonPatch];
    let duration = this.duration.champions;

    return { cache, initialized, duration };
  }
}