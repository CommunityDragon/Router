import { Component } from '@nestjs/common';
import RequestEntity from '../entity/requestentity';
import DataManager from '../entity/datamanager';
import { Types } from '../entity/routetypes';
import CDNEntity from '../entity/cdnentity';
import { ResponseEntity,  } from '../entity/responseentity';
import Axios from 'axios';
import { Urls } from '../entity/urls';
import CDragon from '../entity/cdragon';

const cdragon = CDragon.getInstance();
const dataManager = DataManager.getInstance();

@Component()
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
      championKey: null,
      championId: null,
      skinId: null
    }
    
    dataRoutes = dataRoutes.filter(
      ({ cdnRoute }) => {
        if (cdnRoute.route.length != segmentLength) return false;
        
        if (!cdnRoute.route.every((route: any, i: number) => {
          let correctType = (reqRoutes[i].types.indexOf(route.type) != -1);
          
          if (correctType) {
            if (route.type == Types.CHAMPION_ID) {
              let { id, key } = champions.filter((champion) => champion.id == reqRoutes[i].segment)[0];
              paramData.championKey = key;
              paramData.championId = id;
            }

            if (route.type == Types.CHAMPION_KEY) {
              let { id, key } = champions.filter(
                (champion) => champion.key.toLocaleLowerCase() == reqRoutes[i].segment.toLocaleLowerCase()
              )[0];
              paramData.championKey = key;
              paramData.championId = id;
            }

            if (route.type == Types.SKIN_ID) {
              paramData.skinId = reqRoutes[i].segment
            }

            if (route.type == Types.ROUTE) {
              return (route.value == reqRoutes[i].segment)
            }
          }
          return correctType;
        })) return false;
        
        if (
          reqEntity.getFormat() 
          && reqEntity.getFormat() != cdnRoute.format
        ) return false;
        
        return true;
      }
    );
    
    return await Promise.all(dataRoutes.map(async (x) => {
      return await (new ResponseEntity(x.rawRoute, reqEntity.getPatch().getCDragonPatch(), paramData)).getUrl();
    })) 
  }
  
  /**
  * 
  * @param {string[]} urls 
  */
  async pipeFile(urls: string[], res) {
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(Urls.CDRAGON_RAW_BASE + urls[i]);
        let { data, status } = await Axios({
          responseType: 'stream',
          method: 'get',
          url: Urls.CDRAGON_RAW_BASE + urls[i]
        })
        
        res.type((urls[i].split('.')).pop())
        data.pipe(res);
        return;
      } catch(e) {}
    }
    
    res.status(404);
    res.send();
  }
}
