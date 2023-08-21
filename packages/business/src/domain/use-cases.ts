import { FindClinicalTrials } from '../ports/repository'
import { ClinicalTrial, CountryCode } from './entities'

type OnGoingFilter = { sponsorName?: string, countryCode?: CountryCode }

type GetOnGoingClinicalTrials = (findOnGoingClinicalTrials: FindClinicalTrials) =>
  (filter?: OnGoingFilter) => Promise<ClinicalTrial[]>

export { GetOnGoingClinicalTrials }
