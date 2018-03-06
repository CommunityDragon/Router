import Patch from "../entity/patch";
import RequestEntity from "../entity/requestentity";
import Route from "../entity/route";

export default class RequestEntityFactory {
  
  /**
  * 
  * @param {string} path the path after the patch
  * @param {Patch} patch the requested patch
  */
  public async produceEntity(path: string, patch: Patch) { 
    let routeStrings = path.split('/');
    let lastRouteString = routeStrings.pop();
    let [endpoint, format] = lastRouteString.split('.');

    routeStrings.push(endpoint);
    
    let routes: Promise<Route>[] = routeStrings.map(async (routeString) => {
      let route = new Route(routeString);
      await route.init(patch);
      return route;
    })

    let re = new RequestEntity(
      patch,
      await Promise.all(routes),
      format||null
    );

    await re.filterRoutes();
    return re;
  }
}