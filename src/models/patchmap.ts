import axios from 'axios'

const CDRAGON_PATCH_BASE = 'https://raw.communitydragon.org/json/'
const DDRAGON_PATCH_BASE = 'https://ddragon.leagueoflegends.com/api/versions.json'

export class PatchMap {

  private static singleton: PatchMap
  private initialized: boolean
  private patches: Patch[]

  private constructor() { 
    this.initialized = false
    this.patches = []
  }

  async init(): Promise<PatchMap> {
    if (this.initialized) return this

    const cdragonPatches: string[] = await this.fetchCDragonPatches()
    const ddragonPatches: string[] = await this.fetchDDragonPatches()

    cdragonPatches.forEach(cdragonPatch => {
      let mapped = false

      ddragonPatches.forEach(ddragonPatch => {
        if (ddragonPatch.startsWith(cdragonPatch + '.')) {
          this.patches.push(new Patch(ddragonPatch, cdragonPatch))
          mapped = true
        }
      })

      if (!mapped && cdragonPatch !== 'latest' && cdragonPatch !== 'pbe') {
        this.patches.push(new Patch(cdragonPatch + '.1', cdragonPatch))
      }
    })

    const lastDDragonPatch = ddragonPatches[ddragonPatches.length - 1]
    const lastCDragonPatch = cdragonPatches[cdragonPatches.length - 1]

    if (!lastDDragonPatch.startsWith(lastCDragonPatch + '.')) {
      this.patches.push(new Patch(lastDDragonPatch, lastCDragonPatch))
    }
    this.patches.push(new Patch('latest', 'latest'))
    this.patches.push(new Patch('pbe', 'pbe'))
    this.patches.reverse()
  
    this.initialized = true
    return this
  }

  hasDDragonPatch(patch: string): Patch {
    return this.patches.find(({ ddragon }) => ddragon == patch)
  }

  async fetchPatches(): Promise<Patch[]> {
    await this.init()
    return this.patches
  }

  /**
   * Fetches and returns CDragon patches
   */
  private async fetchCDragonPatches(): Promise<string[]> {
    let rawPatches = (await axios.get(CDRAGON_PATCH_BASE)).data
      .filter(({ type }) => type === 'directory')
      .filter(({ name }) => name != 'latest' && name != 'pbe')
      .map(({ name }) => name)
      .sort(sortCDragonPatches)
    return rawPatches
  }

  /**
   * Fetches and returns DDragon patches
   */
  private async fetchDDragonPatches(): Promise<string[]> {
    let rawPatches = (await axios.get(DDRAGON_PATCH_BASE)).data
    return rawPatches.splice(0, rawPatches.findIndex(patch => patch === '7.1.1') + 1)
      .reverse()
  }

  /**
   * Returns the instance. Creates an instance
   * if no instance has been initialized yet.
   */
  public static instance(): PatchMap {
    if (!this.singleton) this.singleton = new PatchMap()
    return this.singleton
  }

  public getPatches(): Patch[] {
    return this.patches
  }
  
  public getDDragonPatches(): string[] {
    return this.patches.map(patch => patch.ddragon)
  }

  public getCDragonPatches(): string[] {
    return this.patches.map(patch => patch.cdragon)
  }
}

/**
 * A Patch object that contains a DDragon patch
 * and associated CDragon patch
 */
class Patch {

  public readonly ddragon: string
  public readonly cdragon: string

  public constructor(
    ddragonPatch: string, 
    cdragonPatch: string,
  ) {
    this.ddragon = ddragonPatch
    this.cdragon = cdragonPatch
  }
}

function sortCDragonPatches(a, b): number {
  let [a1, a2] = a.split('.')
  let [b1, b2] = b.split('.')

  a1 = parseInt(a1)
  a2 = parseInt(a2)
  b1 = parseInt(b1)
  b2 = parseInt(b2)

  switch (true) {
    case a1 > b1:
      return 1
    case a1 < b1:
      return -1
    case a1 === b1:
      switch (true) {
        case a2 > b2:
          return 1
        case a2 < b2:
          return -1
        case a2 === b2:
          return 0
      }
  }
}
