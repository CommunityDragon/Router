import { Injectable } from '@nestjs/common';
import RequestEntity from '../entity/requestentity';
import DataManager from '../entity/datamanager';
import GenericID from '../entity/genericid';
import { Types } from '../entity/routetypes';
import { ResponseEntity,  } from '../entity/responseentity';
import Axios from 'axios';
import { Urls } from '../entity/urls';
import CDragon from '../entity/cdragon';

const cdragon = CDragon.getInstance();
const dataManager = DataManager.getInstance();

@Injectable()
export class DynamicService {

  /**
   * Filters the CDN entities to only get the ones matching with the Request entity
   *
   * @param reqEntity
   */
  async filterCDNEntities(reqEntity: RequestEntity): Promise<any[]> {
    let champions = await cdragon.getChampions(reqEntity.getPatch());
    let reqRoutes = reqEntity.getRoutes();
    let dataRoutes = dataManager.getRoutes();
    let segmentLength = reqRoutes.length;
    
    let paramData = {
      genericIds: [],
      championKey: null,
      championId: null,
      skinId: null
    };
    
    dataRoutes = dataRoutes.filter(
      ({ cdnRoute }) => {
        if (cdnRoute.route.length != segmentLength) return false;

        if (!this.isValidRoute(
          cdnRoute, 
          reqRoutes, 
          paramData, 
          champions)
        ) return false;
        
        return !(reqEntity.getFormat()
          && reqEntity.getFormat() != cdnRoute.format);
      }
    );

    let urls = [];

    for (let i = 0; i < dataRoutes.length; i++) {
      const x = dataRoutes[i];

      let value = await (
        new ResponseEntity(x.rawRoute, reqEntity.getPatch().getCDragonPatch(), paramData)
      ).getUrl();

      if (typeof value == 'string') urls.push(value);
      else value.forEach(url => { urls.push(url) }); 
    }

    return Promise.all(urls);
  }

  /**
   * checks if it is a valid route and assigns values to the paramData
   * 
   * @param cdnRoute 
   * @param reqRoutes 
   * @param paramData 
   * @param champions 
   */
  private isValidRoute(cdnRoute, reqRoutes, paramData, champions) {
    return (cdnRoute.route.every((route: any, i: number) => {
      let correctType = (reqRoutes[i].types.indexOf(route.type) != -1);
      
      if (correctType) {
        switch (route.type) {
          case Types.CHAMPION_ID:
            paramData = Object.assign(
              paramData, this.getChampionById(champions, reqRoutes[i])
            );
            return true;
          case Types.CHAMPION_KEY:
            paramData = Object.assign(
              paramData, this.getChampionByKey(champions, reqRoutes[i])
            );
            return true;
          case Types.SKIN_ID:
            paramData.skinId = reqRoutes[i].segment;
            return true;
          case Types.GENERIC_ID:
            paramData.genericIds.push(new GenericID(reqRoutes[i].segment, route.identifier))
            return true;
          case Types.ROUTE:
            return (route.value == reqRoutes[i].segment)
        }
      }
      return correctType;
    }));
  }
  
  /**
   * returns the championId and ChampionKey by Key
   * 
   * @param champions 
   * @param reqRoute 
   */
  private getChampionByKey(champions: any[], reqRoute: any) {
    let champion =  champions.filter(
      (champion) => champion.key.toLocaleLowerCase() == reqRoute.segment.toLocaleLowerCase()
    )[0];
    return { championId: champion.id, championKey: champion.key }
  }

  /**
   * returns the championId and ChampionKey by ID
   * 
   * @param champions 
   * @param reqRoute 
   */
  private getChampionById(champions: any[], reqRoute: any) {
    let champion = champions.filter(
      (champion) => champion.id == reqRoute.segment
    )[0];
    return { championId: champion.id, championKey: champion.key }
  }

  /**
   * returns the piped URL
   *
   * @param {string[]} urls
   * @param res
   */
  async pipeFile(urls: string[], res) {
    for (let i = 0; i < urls.length; i++) {
      try {
        let { data } = await Axios({
          responseType: 'stream',
          method: 'get',
          url: Urls.CDRAGON_RAW_BASE + urls[i]
        });
        
        res.type((urls[i].split('.')).pop());
        data.pipe(res);
        return;
      } catch(e) {}
    }
    
    res.status(404);
    res.send();
  }
}
