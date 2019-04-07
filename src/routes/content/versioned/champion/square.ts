import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"
import Axios from "axios";

const champRequester = ChampionRequester.instance()

/**
 * Champion Square Router
 */
export const square = new Router({ name: "Champion Square" })

square.registerEndpoint('get', '', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.squarePortraitPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  square.pipeData(res, url)
})
