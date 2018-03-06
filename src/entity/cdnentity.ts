export default class CDNEntity {
  public rawRoute: any;
  public cdnRoute: any;
  
  constructor(rawRoute: object[], cdnRoute: object[]) {
    this.rawRoute = rawRoute;
    this.cdnRoute = cdnRoute;
  }
}