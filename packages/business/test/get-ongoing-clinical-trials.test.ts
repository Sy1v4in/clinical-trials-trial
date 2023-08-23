import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { faker } from '@faker-js/faker'
import sinon from 'sinon'

import { ClinicalTrial } from '../src/domain'
import { getOnGoingClinicalTrials } from '../src'

import { clinicalTrialsFactory } from './factories/clinical-trials'

describe('Get OnGoing clinical trials', () => {
  let sandbox: sinon.SinonSandbox,
    findClinicalTrials: sinon.SinonStub<void, Promise<ClinicalTrial[]>>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    findClinicalTrials = sandbox.stub()
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
    it('should return the matching filtered trials', async () => {
      const onGoingClinicalTrials = [
        clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'FR' } }),
        clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'FR' } }),
        clinicalTrialsFactory.build({ sponsor: 'Glaxo', country: { code: 'FR' } }),
        clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'FR' }, endDate: faker.date.past() }),
        clinicalTrialsFactory.build({ sponsor: 'Sanofi', country: { code: 'DE' }  }),
      ]
      findClinicalTrials.resolves(onGoingClinicalTrials)

      const clinicalTrials =
        await getOnGoingClinicalTrials(findClinicalTrials)({ sponsorName: 'Sanofi', countryCode: 'FR' })

      assert.deepEqual(clinicalTrials, onGoingClinicalTrials.slice(0, 2))
    })
  })
})
