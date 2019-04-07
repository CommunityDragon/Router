import { ChampionIdentifier } from "../../../../models/identifiers/champion";
import { ChampionRequester } from "../../../../models/requesters/champion";
import { Router } from "../../../../models/router";

import { championSelect } from './championselect'
import { splashArt } from './splashart'
import { portrait } from './portrait'
import { ability } from './ability'
import { square } from './square'
import { data } from './data'
import { tile } from './tile'

const champIdentifier = ChampionIdentifier.instance()
const champRequester = ChampionRequester.instance()

/**
 * Champion Data Router Handler
 */
const championHandler = async (req, res, next) => {
  req['champion'] = await champIdentifier.fetchChampion(
    req['patch'].cdragon, 
    req.params.champion,
  )

  if (req['champion']) next()
  else res.status(404).send({ 
    error: `Champion '${req.params.champion}' not found`
  })
}

/**
 * Champion Router
 */
export const champion = new Router({ name: "Champion" }, '/:champion', championHandler)

champion.registerBase('get', '', async (req, res) => {
  res.send(await champIdentifier.fetchChampions(req['patch'].cdragon))
})

champion.registerEndpoint('get', '/skin', async (req, res) => {
  res.send((await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  ))['skins'].map(
    ({ id, name }) => ({ id: (id - (req['champion'].id * 1000)), name })
  ))
})
champion.registerRouter('/data', data)
champion.registerRouter('/square', square)
champion.registerRouter('/tile', tile)
champion.registerRouter('/ability', ability)
champion.registerRouter('/portrait', portrait)
champion.registerRouter('/splash-art', splashArt)
champion.registerRouter('/ability-icon', ability)
champion.registerRouter('/champ-select', championSelect)