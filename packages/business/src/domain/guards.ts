import {COUNTRIES, CountryCode} from './entities'

const isCountryCode = (code: string): code is CountryCode => Object.keys(COUNTRIES).includes(code)

export { isCountryCode }
