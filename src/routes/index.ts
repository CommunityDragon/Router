import { Router } from "../models/router"
import { content } from "./content"
import { helper } from "./helper"

export const router = new Router({ name: "Root", root: true })
router.registerEndpoint('get', '/endpoints', (req, res) => {
  const tree = router.tree()
  let allEndpoints = []
  let items = [tree]

  while (items.length > 0) {
    let newItems = []

    items.forEach(({ endpoints, children }) => {
      if (endpoints) endpoints.forEach(endpoint => {
          allEndpoints = allEndpoints.concat(endpoint)
      })

      if (children && children.length > 0) {
        newItems = newItems.concat(children)
      }
    })

    items = newItems
  }

  res.send(allEndpoints)
})
router.registerEndpoint('get', '/mapping', (req, res) => res.send(router.tree()))
router.registerRouter('', helper)
router.registerRouter('', content)
