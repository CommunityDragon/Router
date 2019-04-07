import { ChampionRequester } from "../../../../models/requesters/champion"
import { Router } from "../../../../models/router"
import { URL } from "../../../../constants/url"

const champRequester = ChampionRequester.instance()

/**
 * Champion Ability Router
 */
export const ability = new Router({ name: "Champion Ability" })

ability.registerEndpoint('get', '', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  let abilities = []
  abilities.push({ value: 'p', name: champion.passive.name })

  champion.spells.forEach(({ spellKey, name }) => {
      abilities.push({ value: spellKey, name: name })
  });

  res.send(abilities)
})


ability.registerEndpoint('get', '/:ability', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  let path = null

  if (req.params.ability == "p" || req.params.ability == "passive") {
    path = champion.passive.abilityIconPath.replace(
      "lol-game-data/assets", 
      "rcp-be-lol-game-data/global/default"
    ).toLocaleLowerCase()
  } else if (
    req.params.ability == "q" ||
    req.params.ability == "w" ||
    req.params.ability == "e" ||
    req.params.ability == "r"
  ) {
    path = champion.spells.find(({ spellKey }) => spellKey == req.params.ability)
      .abilityIconPath.replace(
      "lol-game-data/assets", 
      "rcp-be-lol-game-data/global/default"
    ).toLocaleLowerCase()
  }

  if (!path) res.status(404).send({ 
    error: `Ability '${req.params.ability}' not found, should be passive, p, q, w, e or r`
  })

  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  ability.pipeData(res, url)
})

ability.registerEndpoint('get', '/:ability/video', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  let path = null

  if (req.params.ability == "p" || req.params.ability == "passive") {
    path = champion.passive.abilityVideoPath
  } else if (
    req.params.ability == "q" ||
    req.params.ability == "w" ||
    req.params.ability == "e" ||
    req.params.ability == "r"
  ) {
    path = champion.spells.find(({ spellKey }) => spellKey == req.params.ability)
      .abilityVideoPath
  }

  if (!path) res.status(404).send({ 
    error: `Ability '${req.params.ability}' not found, should be passive, p, q, w, e or r`
  })

  const url = `${URL.CLOUDFRONT_VIDEO_BASE}/${path}`

  ability.pipeData(res, url)
})

ability.registerEndpoint('get', '/:ability/video/image', async (req, res) => {
  const champion = await champRequester.fetchChampion(
    req['patch'].cdragon, 
    req['champion'].id
  )

  let path = null

  if (req.params.ability == "p" || req.params.ability == "passive") {
    path = champion.passive.abilityVideoImagePath
  } else if (
    req.params.ability == "q" ||
    req.params.ability == "w" ||
    req.params.ability == "e" ||
    req.params.ability == "r"
  ) {
    path = champion.spells.find(({ spellKey }) => spellKey == req.params.ability)
      .abilityVideoImagePath
  }

  if (!path) res.status(404).send({ 
    error: `Ability '${req.params.ability}' not found, should be passive, p, q, w, e or r`
  })

  const url = `${URL.CLOUDFRONT_VIDEO_BASE}/${path}`

  ability.pipeData(res, url)
})
