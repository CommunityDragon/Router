import { Router } from "../../../../models/router";
import { URL } from "../../../../constants/url"

const honorData = [
  { level: 0, checkpoints: false, rewards: false, capsules: false },
  { level: 1, checkpoints: false, rewards: false, capsules: false },
  { level: 2, checkpoints: true,  rewards: false, capsules: true  },
  { level: 3, checkpoints: true,  rewards: true,  capsules: true  },
  { level: 4, checkpoints: true,  rewards: true,  capsules: true  },
  { level: 5, checkpoints: false, rewards: true,  capsules: true  },
]

/**
 * Honor Router
 */
export const honor = new Router({ name: "Honor" })

honor.registerEndpoint('get', '', async (req, res) => {
  res.send(honorData)
})

honor.registerEndpoint('get', '/generic', async (req, res) => {
  const path = 'rcp-fe-lol-honor/global/default/assets/profile/emblem_generic.png'
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  honor.pipeData(res, url)
})

honor.registerEndpoint('get', ['/locked', '/0/locked'], async (req, res) => {
  const path = 'rcp-fe-lol-honor/global/default/assets/profile/emblem_0_locked.png'
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  honor.pipeData(res, url)
})

honor.registerEndpoint('get', ['/:level'], async (req, res) => {
  const level = req.params.level

  if (isNaN(level)) {
    res.status(404).send({ 
      error: 'Level must be a number'
    })
    return 
  }

  const honorItem = honorData.find(({ level: honorLevel }) => honorLevel == level)

  if (!honorItem) {
    res.status(404).send({ 
      error: `Honor level '${req.params.level}' not found`
    })
    return
  }

  const path = `rcp-fe-lol-honor/global/default/assets/profile/emblem_${level}${
    honorItem.checkpoints ? '-0' : ''
  }.png`
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  honor.pipeData(res, url)
})

honor.registerEndpoint('get', ['/:level/level/:checkpoint', '/:level/checkpoint/:checkpoint'], async (req, res) => {
  const { level, checkpoint } = req.params

  if (isNaN(level) || isNaN(checkpoint)) {
    res.status(404).send({ 
      error: 'Level and checkpoint must both be a number'
    })
    return 
  }

  if (checkpoint < 0 || checkpoint > 3) {
    res.status(404).send({ 
      error: 'Checkpoint should be between 0 and 3'
    })
    return 
  }

  const honorItem = honorData.find(({ level: honorLevel }) => honorLevel == level)

  if (!honorItem) {
    res.status(404).send({ 
      error: `Honor level '${req.params.level}' not found`
    })
    return
  }

  if (!honorItem.checkpoints) {
    res.status(404).send({ 
      error: `This Honor level has no checkpoints`
    })
    return
  }

  const path = `rcp-fe-lol-honor/global/default/assets/profile/emblem_${level}-${checkpoint}.png`
  const url = `${URL.CDRAGON_BASE}/${req['patch'].cdragon}/plugins/${path}`

  honor.pipeData(res, url)
})