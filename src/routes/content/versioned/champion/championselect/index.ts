import { Router } from "../../../../../models/router";
import { sounds } from "./sounds"

/**
 * ChampionSelect Router
 */
export const championSelect = new Router({ name: "ChampionSelect" })

championSelect.registerRouter('/sounds', sounds)

