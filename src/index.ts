import * as express from "express"
import * as bodyParser from 'body-parser'
import { PatchMap } from "./models/patchmap";
import { router } from './routes';

const port = 4000;

(async () => {
  await PatchMap.instance().init()
  const app = express()

  app.use(bodyParser.json({ type: '*/*' }));
  app.use(express.static('public'))
  app.use('/', router.baseRouter)
  
  app.listen(port)
  console.log('API server at http://localhost:' + port)
})()
