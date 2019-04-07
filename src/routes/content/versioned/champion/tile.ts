import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"
import Axios from "axios";

const champRequester = ChampionRequester.instance()

/**
 * Champion Tile Router
 */
export const tile = new Router({ name: "Champion Tile" })

/**
 * Tile
 */
tile.registerEndpoint('get', '', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.skins[0].tilePath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  tile.pipeData(res, url)
})

/**
 * Tile with skin
 */
tile.registerEndpoint('get', '/skin/:skin', async (req, res) => {
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

  const path = skin.tilePath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  tile.pipeData(res, url)
})
