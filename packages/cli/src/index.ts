import { program } from "commander"
import { callClinicalTrialsCommand } from "./call-clinical-trials"

program
  .name("inato-cli")
  .command("trials")
  .description("get the list of ongoing clinical trials")
  .option("-p, --path <type>", "the api path to call", "on-goings")
  .option("-s, --sponsor <sponsor name>", "the sponsor name of the clinical trials")
  .option("-c, --country <country code>", "the country code where the clinical trials are being conducted")
  .action(async function ({ path, sponsor, country }) {
    const clinicalTrials = await callClinicalTrialsCommand(fetch)(path, {sponsor, country})
    console.log(clinicalTrials)
  })
  .parseAsync(process.argv)
