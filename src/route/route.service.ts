import { Injectable } from '@nestjs/common';
import DataController from '../entity/datamanager';
import { Urls } from '../entity/urls';

@Injectable()
export class RouteService {

  mapRoutes(categorized: boolean = false): Array<any> {
    const routes = DataController.getInstance().getRoutes();
    const cdnRoutes = [];

    routes.forEach(({ name, category, cdnRoute }) => {
      let url = `${Urls.CDRAGON_CDN_BASE}:patch`;
      cdnRoute.route.forEach((slice: any) => {
        if (slice.type === 'route') {
          url += '/' + slice.value;
        } else {
          url += `/:${slice.type === 'genericId'
            ? slice.identifier : slice.type}`;
        }
      });

      cdnRoutes.push(categorized ? { name, category, route: url } : url);
    });
    return cdnRoutes;
  }
}
