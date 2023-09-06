import express from 'express'
import { checkSchema, validationResult } from 'express-validator'

import { domain, getOnGoingClinicalTrials } from 'business'

import { Adapters } from '../types'

type OngoingClinicalTrial = {
  name: string
  start_date: string
  end_date: string
  sponsor: string
  country: domain.Country
}

type ValidatedRequestQuery = {
  sponsor?: string
  country?: domain.CountryCode
}

type Request = express.Request<{}, {}, {}, ValidatedRequestQuery>

const checkValidity = checkSchema({
  sponsor: {
    optional: true,
    isString: true,
  },
  country: {
    optional: true,
    custom: {
      options: (country) => domain.guards.isCountryCode(country),
    },
  },
})

const getOngoingClinicalTrialsHandler = ({ findClinicalTrials }: Adapters) => {
  const findOnGoingClinicalTrials = getOnGoingClinicalTrials(findClinicalTrials)
  return async (req: Request, res: express.Response) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({
        error: result.array().map((error: FieldValidationError) => `${error.msg} "${error.value}" for ${error.type} ${error.path}`).join("\n")
      })
    }

    const { sponsor, country } = req.query
    const onGoingClinicalTrials = await findOnGoingClinicalTrials({ sponsorName: sponsor, countryCode: country })
    res.status(200).json(onGoingClinicalTrials.map(toOngoingClinicalTrial))
  }
}

const toOngoingClinicalTrial = (clinicalTrial: domain.ClinicalTrial): OngoingClinicalTrial => ({
  name: clinicalTrial.name,
  sponsor: clinicalTrial.sponsor,
  start_date: format(clinicalTrial.startDate),
  end_date: format(clinicalTrial.endDate),
  country: clinicalTrial.country,
})

const format = (date: Date): string => date.toISOString().split('T')[0]

export { checkValidity, getOngoingClinicalTrialsHandler, toOngoingClinicalTrial }
