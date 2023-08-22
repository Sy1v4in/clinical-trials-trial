import { ClinicalTrial, CountryCode } from '../domain'

type Filter = {
  sponsorName?: string,
  countryCode?: CountryCode,
  before?: Date,
  after?: Date,
  cancel?: boolean,
}

type FindClinicalTrials = (filter?: Filter) => Promise<ClinicalTrial[]>

export { Filter, FindClinicalTrials }
