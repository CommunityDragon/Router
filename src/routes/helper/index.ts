import { Router } from "../../models/router";
import { patches } from "./patches"

/**
 * Helper Router
 * 
 * router that handles additional endpoints that
 * aren't part of content but still needed
 */
export const helper = new Router({ 
  name: "Helper", 
  desc: "Data that isn't core to the content" 
})

helper.registerRouter('/patches', patches)