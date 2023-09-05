import {ClinicalTrial, GetOnGoingClinicalTrials, OnGoingFilter} from './domain'

const getOnGoingClinicalTrials: GetOnGoingClinicalTrials = findClinicalTrials => async (filter= {}) => {
  const clinicalTrials = await findClinicalTrials()
  return filterClinicalTrials(clinicalTrials, filter)
}

const filterClinicalTrials = (clinicalTrials: ClinicalTrial[], filter: OnGoingFilter) =>
  clinicalTrials.filter(trial =>
    isOnGoingClinicalTrial(trial)
      && (!filter.sponsorName || (trial.sponsor === filter.sponsorName))
      && (!filter.countryCode || (trial.country.code === filter.countryCode)))

const isOnGoingClinicalTrial = (clinicalTrial: ClinicalTrial): boolean => {
  const now = new Date()
  return (clinicalTrial.endDate.getTime() > now.getTime())
    && (clinicalTrial.startDate.getTime() < now.getTime())
    && (!clinicalTrial.canceled)
}

export { getOnGoingClinicalTrials }
