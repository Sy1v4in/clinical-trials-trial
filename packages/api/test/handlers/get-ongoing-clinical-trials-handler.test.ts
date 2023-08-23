import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import sinon from 'sinon'

import request from 'supertest'

import {createApp} from '../../src/app'
import {clinicalTrialsFactory} from '../factories/clinical-trials'

describe('GetOngoingClinicalTrialsHandler', () => {
  let sandbox: sinon.SinonSandbox,
    findClinicalTrials: sinon.SinonStub<sinon.SinonStubArgs<Filter>, Promise<ClinicalTrial[]>>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    findClinicalTrials = sandbox.stub()
  })

  it('should return the result', async () => {
    const onGoingClinicalTrials = clinicalTrialsFactory.buildList(3)
    findClinicalTrials.resolves(onGoingClinicalTrials)
    const app = createApp({ findClinicalTrials })

    const response = await request(app).get('/on-goings')

    assert.deepEqual(response.body.map(JSON.stringify), onGoingClinicalTrials.map(JSON.stringify))
  })
})
