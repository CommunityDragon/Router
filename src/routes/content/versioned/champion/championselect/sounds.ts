import { ChampionRequester } from "../../../../../models/requesters/champion"
import { Router } from "../../../../../models/router"
import { URL } from "../../../../../constants/url"


const champRequester = ChampionRequester.instance()

/**
 * ChampionSelect Sounds Router
 */
export const sounds = new Router({ name: "ChampionSelect Sounds" })

/**
 * Ban Sound
 */
sounds.registerEndpoint('get', '/ban', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.banVoPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  sounds.pipeData(res, url)
})

/**
 * Choose Sound
 */
sounds.registerEndpoint('get', '/choose', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.chooseVoPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  sounds.pipeData(res, url)
})

/**
 * Lock-in Sound
 */
sounds.registerEndpoint('get', ['/sfx', '/lock-in'], async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  const path = champion.stingerSfxPath.replace(
    "lol-game-data/assets", 
    "rcp-be-lol-game-data/global/default"
  )

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  sounds.pipeData(res, url)
})