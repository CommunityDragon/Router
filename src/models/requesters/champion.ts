import axios from 'axios'

const CDRAGON_BASE = 'https://raw.communitydragon.org/'
const CDRAGON_CHAMPION = '/plugins/rcp-be-lol-game-data/global/default/v1/champions/'

export class ChampionRequester {

  private static singleton: ChampionRequester
  private data: any[]

  private constructor() { 
    this.data = []
  }

  /**
   * Returns the instance. Creates an instance
   * if no instance has been initialized yet.
   */
  public static instance(): ChampionRequester {
    if (!this.singleton) this.singleton = new ChampionRequester()
    return this.singleton
  }

  public async fetchChampion(patch: string, id: number): Promise<any> {
    if (this.data[patch] && this.data[patch][id]) {
      return this.data[patch][id]
    }

    if (!this.data[patch]) this.data[patch] = []
    this.data[patch][id] = (await axios.get(CDRAGON_BASE + patch + CDRAGON_CHAMPION + id + '.json')).data
    return this.data[patch][id]
  }
}
