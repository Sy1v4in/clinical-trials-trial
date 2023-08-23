import express from 'express'

import { domain, getOnGoingClinicalTrials } from 'business'

import { Adapters } from '../types'

type OngoingClinicalTrial = {
  name: string
  start_date: string
  end_date: string
  sponsor: string
}

type RequestQuery = {
  sponsor: string
}

type Request = express.Request<{}, {}, {}, RequestQuery>

const getOngoingClinicalTrialsHandler = ({ findClinicalTrials }: Adapters) => {
  const findOnGoingClinicalTrials = getOnGoingClinicalTrials(findClinicalTrials)
  return async (req: Request, res: express.Response) => {
    const { sponsor } = req.query
    const onGoingClinicalTrials = await findOnGoingClinicalTrials({ sponsorName: sponsor })
    res.status(200).json(onGoingClinicalTrials.map(toOngoingClinicalTrial))
  }
}

const toOngoingClinicalTrial = (clinicalTrial: domain.ClinicalTrial): OngoingClinicalTrial => ({
  name: clinicalTrial.name,
  sponsor: clinicalTrial.sponsor,
  start_date: format(clinicalTrial.startDate),
  end_date: format(clinicalTrial.endDate),
})

const format = (date: Date): string => date.toISOString().split('T')[0]

export { getOngoingClinicalTrialsHandler, toOngoingClinicalTrial }
