import {ClinicalTrial, GetOnGoingClinicalTrials, OnGoingFilter} from './domain'

type Filter = OnGoingFilter & {
  before: Date,
  after: Date,
}

const getOnGoingClinicalTrials: GetOnGoingClinicalTrials = findClinicalTrials => async (filter) => {
  const now = new Date()
  const clinicalTrials = await findClinicalTrials()
  return filter ? filterClinicalTrials(clinicalTrials, { ...filter, before: now, after: now }) : clinicalTrials
}

const filterClinicalTrials = (clinicalTrials: ClinicalTrial[], filter: Filter) =>
  clinicalTrials.filter(trial => {
    return (trial.endDate.getTime() > filter.after.getTime())
      && (trial.startDate.getTime() < filter.before.getTime())
      && (!filter.sponsorName || (trial.sponsor === filter.sponsorName))
      && (!filter.countryCode || (trial.country.code === filter.countryCode))
  })

export { getOnGoingClinicalTrials }
