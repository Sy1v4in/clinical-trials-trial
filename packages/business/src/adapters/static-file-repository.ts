import path from 'node:path'
import { readFile } from 'node:fs/promises'

import { COUNTRIES, ClinicalTrial } from '../domain'
import { Filter, FindClinicalTrials } from '../ports/repository'

type ApiClinicalTrial = {
  name: string
  country: string
  sponsor: string
  end_date: string
  start_date: string
}

const TRIALS_FILE_PATH_FROM_HERE = '/../../../../trials.json'

const findClinicalTrials: FindClinicalTrials = async (filter?: Filter) => {
  const fetchedClinicalTrials = await loadJson<ApiClinicalTrial[]>(path.join(__dirname, TRIALS_FILE_PATH_FROM_HERE))
  const clinicalTrials = fetchedClinicalTrials.map(toClinicalTrial)
  return filter ? filterClinicalTrials(clinicalTrials, filter) : clinicalTrials
}

const loadJson = async <T = unknown>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, { encoding: 'utf8' })
  return JSON.parse(content)
}

const toClinicalTrial = (apiClinicalTrial: ApiClinicalTrial): ClinicalTrial => {
  const startDate = parseDate(apiClinicalTrial.start_date)
  if (!startDate) throw new Error(`Bad start date ${apiClinicalTrial.start_date}`)

  const endDate = parseDate(apiClinicalTrial.end_date)
  if (!endDate) throw new Error(`Bad end date ${apiClinicalTrial.end_date}`)

  const country = COUNTRIES[apiClinicalTrial.country.toUpperCase()]
  if (!country) throw new Error(`Bad country ${apiClinicalTrial.country}`)

  return {
    name: apiClinicalTrial.name,
    country,
    startDate,
    endDate,
    sponsor: apiClinicalTrial.sponsor,
  }
}

const parseDate = (englishFormat: string): Date => {
  const parts = englishFormat.match(/(\d+)/g)
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const date = parseInt(parts[2])
  if (isNaN(year) || isNaN(month) || isNaN(date)) throw new Error(`Bad date format ${englishFormat}`)
  return new Date(year, month - 1, date)
}


const filterClinicalTrials = (clinicalTrials: ClinicalTrial[], filter: Filter) =>
  clinicalTrials.filter(trial => {
    return (!filter.after || (trial.endDate.getTime() > filter.after.getTime()))
      && (!filter.before || (trial.startDate.getTime() < filter.before.getTime()))
      && (!filter.sponsorName || (trial.sponsor === filter.sponsorName))
  })

export { findClinicalTrials }
