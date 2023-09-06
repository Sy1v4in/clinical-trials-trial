import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { Express } from 'express'
import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import request from 'supertest'

import { domain, errors } from 'business'

import { createApp } from '../../src/app'
import { clinicalTrialsFactory } from '../factories/clinical-trials'
import { toOngoingClinicalTrial } from '../../src/handlers/get-ongoing-clinical-trials-handler'

describe('GetOngoingClinicalTrialsHandler', () => {
  let sandbox: sinon.SinonSandbox,
    findClinicalTrials: sinon.SinonStub<void[], Promise<domain.ClinicalTrial[]>>,
    onGoingClinicalTrials: domain.ClinicalTrial[],
    app: Express

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    findClinicalTrials = sandbox.stub()

    app = createApp({findClinicalTrials})
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('when the code country does not match an actual code', () => {
    it('should fail with an error 400', async () => {
      const response = await request(app).get('/on-goings?country=BAD')

      assert.equal(response.statusCode, 400)
    })
  })

  describe('With succeed findClinicalTrials', () => {
    beforeEach(() => {
      onGoingClinicalTrials = [
        clinicalTrialsFactory.build({sponsor: 'Sanofi', country: {code: 'FR'}}),
        clinicalTrialsFactory.build({sponsor: 'Sanofi', country: {code: 'FR'}}),
        clinicalTrialsFactory.build({sponsor: 'Sanofi', country: {code: 'DE'}}),
        clinicalTrialsFactory.build({sponsor: 'AstraZeneca', country: {code: 'FR'}}),
        clinicalTrialsFactory.build({sponsor: 'Sanofi', endDate: faker.date.past()}),
      ]
      findClinicalTrials.resolves(onGoingClinicalTrials)
    })

    it('should return the valid trials returned by findClinicalTrials', async () => {
      const response = await request(app).get('/on-goings')

      assert.equal(response.statusCode, 200)
      assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 4).map(toOngoingClinicalTrial))
    })

    describe('when a sponsor name is provided as query params', () => {
      it('should return the trials filtered by the sponsor', async () => {
        const response = await request(app).get('/on-goings?sponsor=Sanofi')

        assert.equal(response.statusCode, 200)
        assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 3).map(toOngoingClinicalTrial))
      })
    })

    describe('when a sponsor name and a country code are provided as query params', () => {
      it('should return the trials filtered by the sponsor', async () => {
        const response = await request(app).get('/on-goings?sponsor=Sanofi&country=FR')

        assert.equal(response.statusCode, 200)
        assert.deepEqual(response.body, onGoingClinicalTrials.slice(0, 2).map(toOngoingClinicalTrial))
      })
    })
  })

  describe('with failing findClinicalTrials with a Business error', () => {
    it('should fail with an error 400', async () => {
      findClinicalTrials.rejects(new errors.ValidationError('Bad date format'))

      const response = await request(app).get('/on-goings')

      assert.equal(response.statusCode, 400)
      assert.deepEqual(response.body, { error: 'A validation error has occurred: Bad date format' })
    })
  })

  describe('with failing findClinicalTrials with a unknown error', () => {
    it('should fail with an error 400', async () => {
      findClinicalTrials.rejects(new Error('Oops'))

      const response = await request(app).get('/on-goings')

      assert.equal(response.statusCode, 500)
      assert.deepEqual(response.body, { error: 'An error occurred: Oops' })
    })
  })
})
