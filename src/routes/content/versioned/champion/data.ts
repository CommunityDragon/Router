import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";

const champRequester = ChampionRequester.instance()

/**
 * Champion Data Router
 */
export const data = new Router({ name: "Champion Data" })

data.registerEndpoint('get', '', async (req, res) =>
   res.send(await champRequester.fetchChampion(
      req['patch'].cdragon, 
      req['champion'].id
   ))
)
