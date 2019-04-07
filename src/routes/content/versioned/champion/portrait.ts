import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"
import Axios from "axios";

const champRequester = ChampionRequester.instance()

/**
 * Champion Portrait Router
 */
export const portrait = new Router({ name: "Champion Portrait" })

/**
 * Portrait
 */
portrait.registerEndpoint('get', '', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.skins[0].loadScreenPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  ).toLocaleLowerCase()

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  portrait.pipeData(res, url)
})

/**
 * Portrait with skin
 */
portrait.registerEndpoint('get', '/skin/:skin', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const skin = champion.skins.find(({ id }) => 
    id == (req['champion'].id * 1000 + parseInt(req.params.skin))
  )

  if (!skin) res.status(404).send({ 
    error: `Skin '${req.params.skin}' not found`
  })

  const path = skin.loadScreenPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  ).toLocaleLowerCase()

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  portrait.pipeData(res, url)
})
