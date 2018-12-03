import CDragon from './cdragon';
import Patch from './patch';
import Route from './route';
import { Types } from './routetypes';

const cdragon = CDragon.getInstance();

export default class RequestEntity {

  private patch: Patch;
  private routes: Route[];
  private format: string = null;

  constructor(patch: Patch, routes: Route[], format?: string ) {
    this.patch = patch;
    this.format = format;
    this.routes = routes;
  }

  async filterRoutes() {
    const champions = await cdragon.getChampions(this.patch);
    let champion = null;
    let skin = null;

    this.routes.forEach(route => {
      let hasChampionRoute = false;
      route.types = route.types.filter(type => {
        switch (type) {

          case Types.CHAMPION_ID:
            if (!champion) {
              hasChampionRoute = true;
              champion = champions.filter(
                (x: any) => (x.id === route.segment),
              )[0];
              return true;
            } else return false;

          case Types.CHAMPION_KEY:
            if (!champion) {
              hasChampionRoute = true;
              champion = champions.filter(
                (x: any) => (x.key === route.segment),
              )[0];
              return true;
            } else return false;

          case Types.SKIN_ID:
            if (champion && !skin && !hasChampionRoute) {
              const temp = champion.skins.filter(
                (x: any) => (x.id === route.segment),
              );

              if (temp.length > 0) {
                skin = temp[0];
                return true;
              } else return false;
            } else return false;

          default:
            return true;
        }
      });
    });
  }

  getPatch(): Patch {
    return this.patch;
  }

  getRoutes(): Route[] {
    return this.routes;
  }

  getFormat(): (string|null) {
    return this.format;
  }
}