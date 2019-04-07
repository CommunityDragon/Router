import { PatchMap } from "../../../models/patchmap"
import { Router } from "../../../models/router"

import { profileIcon } from './profileIcon'
import { champion } from "./champion"
import { honor } from "./honor"
import { ward } from "./ward"

/**
 * Versioned Data Router
 */
export const versioned = new Router(
  { name: "Versioned Data" }, 
  '/:patch', 
  (req, res, next) => {
    req['patch'] = PatchMap.instance().hasDDragonPatch(req.params.patch)

    if (req['patch']) next()
    else res.status(404).send(
      { error: `Patch '${req.params.patch}' doesn't exist` }
    )
  }
)

versioned.registerRouter('/honor', honor)
versioned.registerRouter('/honor/emblem', honor)
versioned.registerRouter('/champion', champion)
versioned.registerRouter('/ward', ward)
versioned.registerRouter('/profile-icon', profileIcon)
