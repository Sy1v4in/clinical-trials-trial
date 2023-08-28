type ClinicalTrialAPI = {
  name: string
  sponsor: string
  country: { name: string }
}

type BadRequestError = {
  errors: [{
    type: string
    value: string
    msg: string
    path: string
  }]
}

type UnknownError = {}

type Body = ClinicalTrialAPI[] | BadRequestError | UnknownError

type Fetch = (url: URL) => Promise<Response>

type SearchFilter = { sponsor?: string, country?: string }
type CallClinicalTrials = (path: string, searchFilter?: SearchFilter) => Promise<string>

const URL_BASE = "http://localhost:8080"

const callClinicalTrialsCommand = (fetch: Fetch): CallClinicalTrials => async (path, { sponsor, country} = {}) => {
  const url = new URL(path, URL_BASE)
  sponsor && url.searchParams.append('sponsor', sponsor)
  country && url.searchParams.append('country', country)

  const response: Response = await fetch(url)
  const body: Body = await response.json()

  let result = unknownErrorMessage()
  if (isOk(response)) {
    result = clinicalTrialsMessage(body as ClinicalTrialAPI[])
  }
  else if (isBadRequest(response)) {
    result = errorMessage(body as BadRequestError)
  }

  return result
}

const isOk = (response: Response): boolean => response.status < 400

const isBadRequest = (response: Response): boolean => response.status === 400

const clinicalTrialsMessage = (clinicalTrials: ClinicalTrialAPI[]): string =>
  clinicalTrials.map(trial => `${trial.name}, ${trial.country.name}`).join("\n")

const errorMessage = (error: BadRequestError): string =>
  error.errors.map(error => `${error.msg} "${error.value}" for ${error.type} ${error.path}`).join("\n")

const unknownErrorMessage = (): string =>
  'An unknown error occurred. You can retry in a few moments and contact the development team if the problem persists.'

export { CallClinicalTrials, ClinicalTrialAPI, Fetch, SearchFilter, callClinicalTrialsCommand }
