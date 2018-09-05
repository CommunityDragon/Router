import { Get, Controller } from '@nestjs/common';
import DataController from '../entity/datamanager';
import { Urls } from '../entity/urls';

@Controller('endpoints')
export class RouteController {
  
  @Get()
  async getRoutes() {
    let routes = DataController.getInstance().getRoutes();
    let cdnRoutes = [];
    
    routes.forEach(({ cdnRoute }) => {
      let url = `${Urls.CDRAGON_CDN_BASE}:patch`;
      cdnRoute.route.forEach((slice: any) => {
        if (slice.type == 'route') {
          url += '/' + slice.value
        } else {
          url += `/:${slice.type == 'genericId'
            ? slice.identifier : slice.type}`
        }
      });
      cdnRoutes.push(url)
    });
    return cdnRoutes;
  }
}
