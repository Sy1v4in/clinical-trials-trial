import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { Express } from 'express'
import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import request from 'supertest'

import { domain } from 'business'

import { createApp } from '../../src/app'
import { clinicalTrialsFactory } from '../factories/clinical-trials'
import { toOngoingClinicalTrial } from '../../src/handlers/get-ongoing-clinical-trials-handler'

describe('GetOngoingClinicalTrialsHandler', () => {
  let sandbox: sinon.SinonSandbox,
    findClinicalTrials: sinon.SinonStub<sinon.SinonStubArgs<Filter>, Promise<ClinicalTrial[]>>,
    onGoingClinicalTrials: domain.ClinicalTrial[],
    app: Express

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    findClinicalTrials = sandbox.stub()

    onGoingClinicalTrials = [
      clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'FR' } }),
      clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'FR' } }),
      clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'DE' } }),
      clinicalTrialsFactory.build({ sponsor: 'AstraZeneca', country: { code: 'FR' } }),
      clinicalTrialsFactory.build({ sponsor: 'Sanofi', endDate: faker.date.past() }),
    ]
    findClinicalTrials.resolves(onGoingClinicalTrials)

    app = createApp({ findClinicalTrials })
  })

  it('should return the valid trials returned by findClinicalTrials', async () => {
    const response = await request(app).get('/on-goings')

    assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 4).map(toOngoingClinicalTrial))
  })

  describe('when a sponsor name is provided as query params', () => {
    it('should return the trials filtered by the sponsor', async () => {
      const response = await request(app).get('/on-goings?sponsor=Sanofi')

      assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 3).map(toOngoingClinicalTrial))
    })
  })

  describe('when a sponsor name and a country code are provided as query params', () => {
    it('should return the trials filtered by the sponsor', async () => {
      const response = await request(app).get('/on-goings?sponsor=Sanofi&country=FR')

      assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 2).map(toOngoingClinicalTrial))
    })
  })
})
