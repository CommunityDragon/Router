import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"

/**
 * Ward Router
 */
export const ward = new Router({ name: "Ward" })

ward.registerEndpoint('get', '/:wardId', async (req, res) => {
  const wardId = req.params.wardId

  if (isNaN(wardId)) {
    res.status(404).send({ 
      error: 'WardId must be a number'
    })
    return 
  }

  const path = `rcp-be-lol-game-data/global/default/content/src/leagueclient/wardskinimages/wardhero_${wardId}.png`
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  ward.pipeData(res, url)
})

ward.registerEndpoint('get', '/:wardId/shadow', async (req, res) => {
  const wardId = req.params.wardId

  if (isNaN(wardId)) {
    res.status(404).send({ 
      error: 'WardId must be a number'
    })
    return 
  }

  const path = `rcp-be-lol-game-data/global/default/content/src/leagueclient/wardskinimages/wardheroshadow_${wardId}.png`
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  ward.pipeData(res, url)
})
