import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { findClinicalTrials } from '../../src/adapters'

describe('Find clinical trials from static file', () => {
  it('should return all the clinical trials', async () => {
    const clinicalTrials = await findClinicalTrials()

    assert.equal(clinicalTrials.length, 6)
  })
})
