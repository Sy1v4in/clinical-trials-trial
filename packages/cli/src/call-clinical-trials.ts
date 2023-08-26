type ClinicalTrialAPI = {
  name: string
  sponsor: string
  country: { name: string }
}

type Fetch = (url: URL) => Promise<Response>

type SearchFilter = { sponsor?: string, country?: string }
type CallClinicalTrials = (path: string, searchFilter?: SearchFilter) => Promise<string>

const URL_BASE = "http://localhost:8080"

const callClinicalTrialsCommand = (fetch: Fetch): CallClinicalTrials => async (path, { sponsor, country} = {}) => {
  const url = new URL(path, URL_BASE)
  sponsor && url.searchParams.append('sponsor', sponsor)
  country && url.searchParams.append('country', country)

  const response: Response = await fetch(url)
  const clinicalTrials: ClinicalTrialAPI[] = await response.json()
  return clinicalTrials.map(trial => `${trial.name}, ${trial.country.name}`).join("\n")
}

export { CallClinicalTrials, ClinicalTrialAPI, Fetch, SearchFilter, callClinicalTrialsCommand }
