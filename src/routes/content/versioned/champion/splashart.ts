import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"
import Axios from "axios";

const champRequester = ChampionRequester.instance()

/**
 * Champion SplashArt Router
 */
export const splashArt = new Router({ name: "Champion Splash Art" })

/**
 * Base un-centered SplashArt
 */
splashArt.registerEndpoint('get', '', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.skins[0].uncenteredSplashPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  splashArt.pipeData(res, url)
})

/**
 * Base un-centered SplashArt with skin
 */
splashArt.registerEndpoint('get', '/skin/:skin', async (req, res) => {
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

  const path = skin.uncenteredSplashPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  splashArt.pipeData(res, url)
})

/**
 * Base centered SplashArt
 */
splashArt.registerEndpoint('get', '/centered', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.skins[0].splashPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  splashArt.pipeData(res, url)
})

/**
 * Base centered SplashArt with skin
 */
splashArt.registerEndpoint('get', '/centered/skin/:skin', async (req, res) => {
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

  const path = skin.splashPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  splashArt.pipeData(res, url)
})