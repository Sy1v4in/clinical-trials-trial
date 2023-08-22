import { GetOnGoingClinicalTrials } from './domain'

const getOnGoingClinicalTrials: GetOnGoingClinicalTrials = findClinicalTrials => filter => {
  const now = new Date()
  return findClinicalTrials({ ...filter, before: now, after: now, cancel: false })
}

export { getOnGoingClinicalTrials }
