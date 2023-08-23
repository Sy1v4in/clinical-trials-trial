import { adapters as businessAdapters } from 'business'

import { startApp } from './app'

startApp({
  findClinicalTrials: businessAdapters.findClinicalTrials,
})
