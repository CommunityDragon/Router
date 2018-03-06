import axios from 'axios';

const urlBase: string = 'http://ddragon.leagueoflegends.com/';
const versions: string = 'api/versions.json';

export default class DDragon {
  
  private static instance: DDragon;
  
  /** duration of cache */
  private duration = {
    patches: 1000 * 3600
  }
  
  /** epoch time of initialization of request */
  private initialized = {
    patches: 0
  }
  
  /** stores the cache of the request */
  private cache = {
    patches: null
  }
  
  private constructor() { }
  
  static getInstance() {
    if (!DDragon.instance) {
      DDragon.instance = new DDragon();
    }
    return DDragon.instance;
  }
  
  /**
  * Get DDragon Patches
  */
  async getPatches(): Promise<string[]> {
    try {
      let initialized = this.initialized.patches;
      let duration = this.duration.patches;
      let cache = this.cache.patches;
      
      if (!cache || initialized + duration < new Date().getTime()) {
        this.cache.patches = (await axios.get(urlBase + versions)).data;
        this.initialized.patches = new Date().getTime();
      }
      
      return this.cache.patches;
    } catch(e) {
      return [];
    }
  }
}