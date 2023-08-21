import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { findClinicalTrials } from '../../src/adapters/static-file-repository'

describe('Find clinical trials from static file', () => {
  describe('without filter', () => {
    it('should return all the clinical trials', async () => {
      const clinicalTrials = await findClinicalTrials()

      assert.equal(clinicalTrials.length, 6)
    })
  })

  describe('with the on going dates of 2018-06-10', () => {
    it('should return 2 old clinical trials', async () => {
      const now = new Date(2018, 5, 10)
      const clinicalTrials = await findClinicalTrials({ before: now, after: now })

      assert.equal(clinicalTrials.length, 2)
      assert.deepEqual(clinicalTrials.map(trial => trial.name), [
        'Topical Calcipotriene Treatment for Breast Cancer Immunoprevention',
        'Neratinib +/- Fulvestrant in HER2+, ER+ Metastatic Breast Cancer',
      ])
    })
  })

  describe('with sponsor Sanofi and the on going dates in august 2023', () => {
    it('should return the 2 Sanofi clinical trials', async () => {
      const now = new Date(2023, 7, 10)
      const clinicalTrials = await findClinicalTrials({ before: now, after: now, sponsorName: 'Sanofi' })

      assert.equal(clinicalTrials.length, 2)
      assert.deepEqual(clinicalTrials.map(trial => trial.name), [
        'Olaparib + Sapacitabine in BRCA Mutant Breast Cancer',
        'Topical Calcipotriene Treatment for Breast Cancer Immunoprevention',
      ])
    })
  })
})
