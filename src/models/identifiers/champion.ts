import axios from 'axios'

const CDRAGON_BASE = 'https://raw.communitydragon.org/'
const CDRAGON_CHAMPIONS = '/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json'

export class ChampionIdentifier {

  private static singleton: ChampionIdentifier
  private data: any[]

  private constructor() { 
    this.data = []
  }

  /**
   * Returns the instance. Creates an instance
   * if no instance has been initialized yet.
   */
  public static instance(): ChampionIdentifier {
    if (!this.singleton) this.singleton = new ChampionIdentifier()
    return this.singleton
  }

  public async fetchChampion(patch: string, champion: string) {
    const champions = await this.fetchChampions(patch)
    const lcChampion = champion.toLowerCase()

    return champions.find(({ id, name, key }) => 
    lcChampion === `${id}` || lcChampion === name.toLowerCase() || lcChampion === key.toLowerCase()
    )
  }

  public async fetchChampions(patch: string): Promise<any[]> {
    if (this.data[patch]) {
      return this.data[patch]
    }
    
    this.data[patch] = (await axios.get(CDRAGON_BASE + patch + CDRAGON_CHAMPIONS)).data
      .map(({ id, name, alias }) => ({ id, name, key: alias }))
      .filter(({ id }) => id != -1)
    return this.data[patch]
  }
}
