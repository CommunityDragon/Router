import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"

/**
 * Profile Icon Router
 */
export const profileIcon = new Router({ name: "Profile Icon" })

profileIcon.registerEndpoint('get', '/:iconId', async (req, res) => {
  const iconId = req.params.iconId

  if (isNaN(iconId)) {
    res.status(404).send({ 
      error: 'IconId must be a number'
    })
    return 
  }

  const path = `rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  profileIcon.pipeData(res, url)
})
