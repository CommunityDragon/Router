import { Router } from "../../models/router";
import { versioned } from "./versioned"

/**
 * CommunityDragon Content Router
 */
export const content = new Router({ name: "Content" })

content.registerRouter('', versioned)

