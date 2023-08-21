const COUNTRIES = {
  AT: "Austria",
  DE: "Germany",
  ES: "Spain",
  FR: "France",
  IT: "Italy",
} as const

type CountryCode = keyof typeof COUNTRIES
type CountryName = typeof COUNTRIES[CountryCode]

type Country = {
  code: CountryCode
  name: CountryName
}

type ClinicalTrial = {
  name: string
  country: Country
  sponsor: string
  startDate: Date
  endDate: Date
}

export { COUNTRIES, Country, CountryCode, CountryName, ClinicalTrial }
