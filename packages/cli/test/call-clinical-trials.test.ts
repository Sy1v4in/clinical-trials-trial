import assert from "node:assert/strict"
import { beforeEach, describe, it } from "node:test"
import sinon from "sinon"

import {
  CallClinicalTrials,
  callClinicalTrialsCommand,
} from "../src/call-clinical-trials"

describe('Call clinical trials', () => {
  let sandbox: sinon.SinonSandbox,
    fetch: sinon.SinonStub<URL[], Promise<Response>>,
    callClinicalTrials: CallClinicalTrials

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    fetch = sandbox.stub().resolves({ json: sandbox.stub().resolves([
      {
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
    ])})
    callClinicalTrials = callClinicalTrialsCommand(fetch)
  })

  describe('when is calling with a path only', () => {
    it('should fetch the service without query params', async () => {
      await callClinicalTrials('ongoings')

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings")).calledOnce)
    })
  })

  describe('when is calling with a path and a sponsor name filter', () => {
    it('should fetch the service with sponsor as query param', async () => {
      await callClinicalTrials('ongoings', { sponsor: "Sanofi" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?sponsor=Sanofi")).calledOnce)
    })
  })

  describe('when is calling with a path and a country code filter', () => {
    it('should fetch the service with country as query param', async () => {
      await callClinicalTrials('ongoings', { country: "FR" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?country=FR")).calledOnce)
    })
  })

  describe('when is calling with a path, sponsor and a country code filter', () => {
    it('should fetch the service with sponsor and country as query params', async () => {
      await callClinicalTrials('ongoings', { sponsor: "Glaxo Smith & Kline", country: "EN" })

      assert.ok(fetch.withArgs(new URL("http://localhost:8080/ongoings?sponsor=Glaxo+Smith+%26+Kline&country=EN")).calledOnce)
    })
  })

  it('should return the clinical trials name with the country', async () => {
    const clinicalTrials = await callClinicalTrials('ongoings', { sponsor: "Sanofi", country: "FR" })

    assert.equal(clinicalTrials, `
Olaparib + Sapacitabine in BRCA Mutant Breast Cancer, France
Topical Calcipotriene Treatment for Breast Cancer Immunoprevention, France
`.trim())
  })
})
