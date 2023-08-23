import express, { Response } from 'express'

import { Adapters } from './types'
import { checkValidity, getOngoingClinicalTrialsHandler } from './handlers/get-ongoing-clinical-trials-handler'

const createApp = (adapters: Adapters) =>
  express()
  .get('/ping', (_req, res: Response) =>  res.send('pong'))
  .get('/on-goings', checkValidity, getOngoingClinicalTrialsHandler(adapters))

const startApp = (adapters: Adapters, port = 8080) =>
  createApp(adapters).listen(port, () => console.log(`Server running on port ${port} 🍺`))

export { createApp, startApp }
