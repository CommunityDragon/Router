import CDNEntity from "./cdnentity";
const fs = require('fs-extra');

export default class DataManager {
  
  private static instance: DataManager;
  private cdnEntities: CDNEntity[] = [];
  
  private constructor() { }
  
  static getInstance() {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }
  
  /**
  * Load the CDN Routes
  */
  async loadCDNRoutes(): Promise<void> {
    try {
      let routes = await fs.readJson('./routes.json');
      routes.forEach(route => {
        this.cdnEntities.push(
          new CDNEntity(route.raw, route.cdn)
        )
      });
      
    } catch(e) {
      throw e;
    }
  }
  
  getRoutes(): CDNEntity[] {
    return this.cdnEntities;
  }
}