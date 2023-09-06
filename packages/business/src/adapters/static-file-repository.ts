import path from 'node:path'
import { readFile } from 'node:fs/promises'

import { COUNTRIES, ClinicalTrial, Country, guards } from '../domain'
import { FindClinicalTrials } from '../ports'
import { ValidationError } from '../errors'

type ApiClinicalTrial = {
  name: string
  country: string
  sponsor: string
  end_date: string
  start_date: string
  canceled: boolean
}

const TRIALS_FILE_PATH_FROM_HERE = '/../../../../trials.json'

const findClinicalTrials: FindClinicalTrials = async () => {
  const fetchedClinicalTrials = await loadJson<ApiClinicalTrial[]>(path.join(__dirname, TRIALS_FILE_PATH_FROM_HERE))
  return fetchedClinicalTrials.map(toClinicalTrial)
}

const loadJson = async <T = unknown>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, { encoding: 'utf8' })
  return JSON.parse(content)
}

const toClinicalTrial = (apiClinicalTrial: ApiClinicalTrial): ClinicalTrial => {
  const startDate = parseDate(apiClinicalTrial.start_date)
  if (!startDate) throw new ValidationError(`Bad start date ${apiClinicalTrial.start_date}`)

  const endDate = parseDate(apiClinicalTrial.end_date)
  if (!endDate) throw new ValidationError(`Bad end date ${apiClinicalTrial.end_date}`)

  const apiCountry = apiClinicalTrial.country.toUpperCase()
  const countryCode = guards.isCountryCode(apiCountry) ? apiCountry : null
  const country: Country = {
    code: countryCode,
    name: COUNTRIES[countryCode.toUpperCase()],
  }
  if (!country) throw new ValidationError(`Bad country ${apiClinicalTrial.country}`)

  return {
    name: apiClinicalTrial.name,
    country,
    startDate,
    endDate,
    sponsor: apiClinicalTrial.sponsor,
    canceled: apiClinicalTrial.canceled,
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

export { findClinicalTrials }
