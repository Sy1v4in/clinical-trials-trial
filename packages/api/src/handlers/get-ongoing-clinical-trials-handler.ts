import { Request, Response } from 'express'

import { domain, getOnGoingClinicalTrials } from 'business'

import { Adapters } from '../types'

type OngoingClinicalTrial = {
  name: string
  start_date: string
  end_date: string
  sponsor: string
}

const getOngoingClinicalTrialsHandler = ({ findClinicalTrials }: Adapters) => {
  const findOnGoingClinicalTrials = getOnGoingClinicalTrials(findClinicalTrials)
  return async (_req: Request, res: Response) => {
    const onGoingClinicalTrials = await findOnGoingClinicalTrials()
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
