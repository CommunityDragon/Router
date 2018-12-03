import Patch from '../entity/patch';
import RequestEntity from '../entity/requestentity';
import Route from '../entity/route';

export default class RequestEntityFactory {

  /**
   *
   * @param {string} path the path after the patch
   * @param {Patch} patch the requested patch
   */
  public async produceEntity(path: string, patch: Patch) {
    const routeStrings = path.split('/');
    const lastRouteString = routeStrings.pop();
    const [endpoint, format] = lastRouteString.split('.');

    routeStrings.push(endpoint);

    const routes: Promise<Route>[] = routeStrings.map(async (routeString) => {
      const route = new Route(routeString);
      await route.init(patch);
      return route;
    });

    const re = new RequestEntity(
      patch,
      await Promise.all(routes),
      format || null,
    );

    await re.filterRoutes();
    return re;
  }
}
