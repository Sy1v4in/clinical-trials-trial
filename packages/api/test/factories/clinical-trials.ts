import { faker } from '@faker-js/faker'
import * as Factory from 'factory.ts'

import { domain } from 'business'

const generateCountry = (): domain.Country => {
  const countries = Object.entries(domain.COUNTRIES)
  const randomIndex = Math.floor(Math.random() * countries.length)
  const randomCountry = countries[randomIndex]
  return {
    code: randomCountry[0] as CountryCode,
    name: randomCountry[1],
  }
}

const clinicalTrialsFactory = Factory.Sync.makeFactory<domain.ClinicalTrial>({
  name: Factory.each(() => faker.lorem.slug()),
  country: Factory.each(generateCountry),
  sponsor: Factory.each(() => faker.company.name()),
  startDate: Factory.each(() => faker.date.past()),
  endDate: Factory.each(() => faker.date.future()),
})

export { clinicalTrialsFactory }
