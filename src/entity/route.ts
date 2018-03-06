import CDragon from "./cdragon";
import Patch from "./patch";
import { Types } from "./routetypes";

const cdragon = CDragon.getInstance()

export default class Route {
  
  public segment: string;
  public types: string[] = []; 
  
  constructor(segment: string) {
    this.segment = segment;
  }
  
  /**
   * initializes the data
   * 
   * @param patch 
   */
  async init(patch: Patch): Promise<void> {
    await this.generateTypes(patch);
  }
  
  /**
   * generates the possible types
   * 
   * @param patch 
   */
  private async generateTypes(patch: Patch): Promise<void> {
    if (this.isAnId()) {
      this.types.push(Types.GENERIC_ID);

      await this.isAChampionId(patch) 
        ? this.types.push(Types.CHAMPION_ID) : null;

      await this.isASkinId(patch) 
        ? this.types.push(Types.SKIN_ID) : null;

    } else {
      this.types.push(Types.ROUTE);

      await this.isAChampionKey(patch) 
        ? this.types.push(Types.CHAMPION_KEY) : null;
    }
  }

  /** 
   * checks if segment is an ID
   */
  private isAnId(): boolean {
    return /^\d+$/.test(this.segment);
  } 

  /** 
   * checks if segment is a champion ID
   */
  private async isAChampionId(patch: Patch): Promise<boolean> {
    let champions = await cdragon.getChampions(patch);
    return ((champions.filter((x: any) => x.id == this.segment)).length > 0);
  }

  /** 
   * checks if segment is a champion Key
   */
  private async isAChampionKey(patch: Patch): Promise<boolean> {
    let champions = await cdragon.getChampions(patch);
    return ((champions.filter(
      (x: any) => x.key.toLocaleLowerCase() == this.segment.toLocaleLowerCase()
    )).length > 0);
  }

  /** 
   * checks if segment is a skin Key
   */
  private async isASkinId(patch: Patch): Promise<boolean> {
    let champions = await cdragon.getChampions(patch);
    return ((champions.filter((champion: any) => 
      ((champion.skins.filter((x: any) => 
        x.id == this.segment
      )).length > 0)
    )).length > 0);
  }
}
