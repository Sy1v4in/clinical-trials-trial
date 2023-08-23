import { Request, Response } from 'express'

import { getOnGoingClinicalTrials } from 'business'

import { Adapters } from '../types'

const getOngoingClinicalTrialsHandler = ({ findClinicalTrials }: Adapters) => {
  const findOnGoingClinicalTrials = getOnGoingClinicalTrials(findClinicalTrials)
  return async (_req: Request, res: Response) => {
    const onGoingClinicalTrials = await findOnGoingClinicalTrials()
    res.status(200).json(onGoingClinicalTrials)
  }
}
export { getOngoingClinicalTrialsHandler }
