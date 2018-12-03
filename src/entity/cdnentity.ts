export default class CDNEntity {
  public name: string;
  public category: string;
  public rawRoute: any;
  public cdnRoute: any;

  constructor(rawRoute: object[], cdnRoute: object[], name?: string, category?: string) {
    this.rawRoute = rawRoute;
    this.cdnRoute = cdnRoute;
    this.category = category;
    this.name = name;
  }
}
