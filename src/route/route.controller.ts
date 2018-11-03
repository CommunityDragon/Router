import { Get, Controller } from '@nestjs/common';
import DataController from '../entity/datamanager';
import { Urls } from '../entity/urls';
import { RouteService } from './route.service';

@Controller('endpoints')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  getRoutes() {
    return this.routeService.mapRoutes();
  }

  @Get('categorized')
  getCategorizedRoutes() {
    return this.routeService.mapRoutes(true);
  }
}
