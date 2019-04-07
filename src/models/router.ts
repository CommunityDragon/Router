import * as express from 'express'
import Axios from 'axios';

export class Router {

  public readonly endpointRouter
  public readonly baseRouter

  public readonly abc = []

  private readonly endpointRoutes = []
  private readonly baseRoutes = []

  public readonly route: string

  public readonly configuration: Configuration
  private children: Router[] = []
  private parent: Router

  /**
   * Router Constructor
   * 
   * @param route - Request Route
   * @param middleware - Express Route
   */
  constructor({ 
    name,
    desc,
    root,
  } : { 
    name: string, 
    desc?: string,
    root?: boolean,
  },
    route: string = '', 
    middleware: (req, res, next) => void = (req, res, next) => { next() },
  ) {
    this.configuration = new Configuration({ name, desc, root });
    this.route = route

    this.endpointRouter = express.Router()
    this.baseRouter = express.Router()

    this.baseRouter.use(route, middleware, this.endpointRouter)
  }

  public tree(fullBase = 'http://localhost:4000', base = '') {
    let paths = []
    let endpoints = []
    let children = []
    this.baseRoutes.forEach(child => {
      typeof child.route == "string"
        ? endpoints.push([fullBase + base + child.route])
        : endpoints.push(child.route.map(childRoute => {
            return fullBase + base + childRoute
        }))

        typeof child.route == "string"
        ? paths.push([base + child.route])
        : paths.push(child.route.map(childRoute => {
            return base + childRoute
        }))
    });

    this.endpointRoutes.forEach(child => {
      typeof child.route == "string"
        ? endpoints.push([fullBase + base + child.route])
        : endpoints.push(child.route.map(childRoute => {
            return fullBase + base + childRoute
        }))

      typeof child.route == "string"
        ? paths.push([base + child.route])
        : paths.push(child.route.map(childRoute => {
            return base + childRoute
        }))
    });
    
    this.abc.forEach(child => {
      children.push(child.router.tree(fullBase + base, this.route + child.route))
    });

    let body = { 
      id: this.configuration.id,
      name: this.configuration.name, 
      desc: this.configuration.description,
      base: void 0,
      paths: void 0,
      endpoints: void 0,
      children: void 0,
    }

    if (base) body.base = base
    if (paths.length) body.paths = paths
    if (endpoints.length) body.endpoints = endpoints
    if (children.length) body.children = children

    return body
  }

  public setParent(router: Router) {
    this.parent = router
  }

  public async pipeData(res, url) {
    try {
      const { data } = await Axios({
        responseType: 'stream',
        method: 'get',
        url: url,
      })

      data.pipe(res)
    } catch (e) {
      res.status(404).send({ 
        error: `File not found`
      })
    }
  }

  /**
   * Register an endpoint to the base
   * 
   * @param option - Request Method Type, e.g. GET, POST
   * @param route - Request Route
   * @param handler - Express Handler
   */
  public registerBase(
    option: string, 
    route: string | string[], 
    handler: (req, res) => void
  ) {
    this.baseRoutes.push({
      route
    })

    this.baseRouter[option](route, handler)
  }

  /**
   * Register an endpoint
   * 
   * @param option - Request Method Type, e.g. GET, POST
   * @param route - Request Route
   * @param handler - Express Handler
   */
  public registerEndpoint(
    option: string, 
    route: string | string[], 
    handler: (req, res) => void
  ) {
    this.endpointRoutes.push({
      route
    })

    this.endpointRouter[option](route, handler)
  }

  /**
   * Registers another Router as a child
   * 
   * @param route = Request Route
   * @param router - Router 
   */
  public registerRouter(
    route: string | string[], 
    router: Router
  ) {
    this.children.push(router)
    router.setParent(this)

    this.abc.push({
      route,
      router
    })
    this.endpointRouter.use(route, router.baseRouter)
  }
}

export class Configuration {

  public readonly id: number
  public readonly name: string
  public readonly root: boolean
  public readonly description: string

  public constructor({ 
    name,
    desc,
    root,
  } : { 
    name: string, 
    desc?: string,
    root?: boolean,
  }) {
    this.id = Math.ceil(1000 * Math.random())
    this.name = name
    this.root = root ? root : false
    this.description = desc
  }
}