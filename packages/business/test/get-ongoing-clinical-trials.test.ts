import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import sinon from 'sinon'

import { ClinicalTrial } from '../src/domain'
import { Filter } from '../src/ports/repository'
import { getOnGoingClinicalTrials } from '../src/get-ongoing-clinical-trials'

import { clinicalTrialsFactory } from './factories/clinical-trials'

describe('Get OnGoing clinical trials', () => {
  const now = new Date()
  let clock,
    sandbox: sinon.SinonSandbox,
    findClinicalTrials: sinon.SinonStub<sinon.SinonStubArgs<Filter>, Promise<ClinicalTrial[]>>

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime())
    sandbox = sinon.createSandbox()
    findClinicalTrials = sandbox.stub()
  })

  afterEach(() => clock.restore())

  it('should call the repository with the right dates and cancel', async () => {
    await getOnGoingClinicalTrials(findClinicalTrials)()

    assert.ok(findClinicalTrials.withArgs({ cancel: false, before: now, after: now }).calledOnce)
  })

  describe('When a sponsor name and a country code are provided in the search filter', () => {
    it('should call the repository with the right dates, cancel, sponsor name and country code', async () => {
      await getOnGoingClinicalTrials(findClinicalTrials)({ sponsorName: 'Sanofi', countryCode: 'DE' })

      assert.ok(findClinicalTrials.withArgs({
        cancel: false,
        before: now,
        after: now,
        sponsorName: 'Sanofi',
        countryCode: 'DE',
      }).calledOnce)
    })
  })

  describe('When the repository does not return any result', () => {
    it('should return an empty result', async () => {
      const noClinicalTrials = []
      findClinicalTrials.resolves(noClinicalTrials)

      const clinicalTrials = await getOnGoingClinicalTrials(findClinicalTrials)()

      assert.deepEqual(clinicalTrials, noClinicalTrials)
    })
  })

  describe('When the repository return some trials', () => {
    it('should return the same trials', async () => {
      const onGoingClinicalTrials = clinicalTrialsFactory.buildList(3)
      findClinicalTrials.resolves(onGoingClinicalTrials)

      const clinicalTrials = await getOnGoingClinicalTrials(findClinicalTrials)()

      assert.deepEqual(clinicalTrials, onGoingClinicalTrials)
    })
  })
})
