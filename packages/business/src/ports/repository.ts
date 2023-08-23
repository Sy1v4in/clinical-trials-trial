import { ClinicalTrial } from '../domain'

type FindClinicalTrials = () => Promise<ClinicalTrial[]>

export { FindClinicalTrials }
