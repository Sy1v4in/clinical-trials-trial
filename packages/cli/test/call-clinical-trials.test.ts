import assert from "node:assert/strict"
import { beforeEach, describe, it } from "node:test"
import sinon from "sinon"

import { callClinicalTrialsCommand } from "../src/call-clinical-trials"

describe('Call clinical trials', () => {
  let sandbox: sinon.SinonSandbox,
    fetch: sinon.SinonStub<URL[], Promise<Response>>

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    fetch = sandbox.stub().resolves({ status: 200, json: sandbox.stub().resolves([]) })
  })

  describe('when is calling with a path only', () => {
    it('should fetch the service without query params', async () => {
      await callClinicalTrialsCommand(fetch)('ongoings')

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings")).calledOnce)
    })
  })

  describe('when is calling with a path and a sponsor name filter', () => {
    it('should fetch the service with sponsor as query param', async () => {
      await callClinicalTrialsCommand(fetch)('ongoings', { sponsor: "Sanofi" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?sponsor=Sanofi")).calledOnce)
    })
  })

  describe('when is calling with a path and a country code filter', () => {
    it('should fetch the service with country as query param', async () => {
      await callClinicalTrialsCommand(fetch)('ongoings', { country: "FR" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?country=FR")).calledOnce)
    })
  })

  describe('when is calling with a path, sponsor and a country code filter', () => {
    it('should fetch the service with sponsor and country as query params', async () => {
      await callClinicalTrialsCommand(fetch)('ongoings', { sponsor: "Glaxo Smith & Kline", country: "EN" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?sponsor=Glaxo+Smith+%26+Kline&country=EN")).calledOnce)
    })
  })

  describe('when is calling with a good filter values', () => {
    beforeEach(() => {
      fetch = sandbox.stub().resolves({
        status: 200,
        json: sandbox.stub().resolves([{
          "country": { name: "France" },
          "end_date": "2025-07-31",
          "name": "Olaparib + Sapacitabine in BRCA Mutant Breast Cancer",
          "sponsor": "Sanofi",
          "start_date": "2018-12-31"
        },
          {
            "country": { name: "France" },
            "end_date": "2032-09-09",
            "name": "Topical Calcipotriene Treatment for Breast Cancer Immunoprevention",
            "sponsor": "Sanofi",
            "start_date": "2018-03-19"
          }
        ])
      })
    })

    it('should return the clinical trials name with the country', async () => {
      const clinicalTrials = await callClinicalTrialsCommand(fetch)('ongoings', { sponsor: "Sanofi", country: "FR" })

      assert.equal(clinicalTrials, `
Olaparib + Sapacitabine in BRCA Mutant Breast Cancer, France
Topical Calcipotriene Treatment for Breast Cancer Immunoprevention, France
`.trim())
    })
  })

  describe('when is calling with a bad filter value', () => {
    it('should return an error message', async () => {
      fetch = sandbox.stub().resolves({
        status: 400,
        json: sandbox.stub().resolves({
          errors: [{
            type: 'field',
            value: 'FDD',
            msg: 'Invalid value',
            path: 'country',
            location: 'query'
          }]
        })
      })
      const clinicalTrials = await callClinicalTrialsCommand(fetch)('ongoings', { country: "FFF" })

      assert.equal(clinicalTrials, 'Invalid value "FDD" for field country')
    })
  })

  describe('when the fetch is failing for unknown reason', () => {
    it('should return an unknown error message', async () => {
      fetch = sandbox.stub().resolves({
        status: 500,
        json: sandbox.stub().resolves({})
      })
      const clinicalTrials = await callClinicalTrialsCommand(fetch)('ongoings', { country: "FFF" })

      assert.equal(clinicalTrials, 'An unknown error occurred. You can retry in a few moments and contact the development team if the problem persists.')
    })
  })
})
