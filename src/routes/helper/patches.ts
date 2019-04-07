import { PatchMap } from "../../models/patchmap";
import { Router } from "../../models/router";

/**
 * Patch Router
 * 
 * shows patches for CDragon and DDragon
 */
export const patches = new Router({ name: "Patches" })

patches.registerEndpoint('get', ['/', '/ddragon'], (_, res) => 
  res.send(PatchMap.instance().getDDragonPatches())
)

patches.registerEndpoint('get', '/cdragon', (_, res) => 
  res.send(PatchMap.instance().getCDragonPatches())
)

patches.registerEndpoint('get', '/mapping', (_, res) => 
  res.send(PatchMap.instance().getPatches())
)
