Pull Request #1: ✨Get on going clinical trials
---------------
**description**: Creation of the `business` package of the application containing the `ClinicalTrial` definition and the
`GetOnGoingClinicalTrials` use case.

A trial is considered _ongoing_ if:
  - its start date is in the past
  - its end date is in the future
  - it has not been canceled

`GetOnGoingClinicalTrials` enables it to query the list of ongoing clinical trials. Two fields are available for queries:
  - Sponsor name
  - Country code

We can have access to a third-party API (represented by [this file](../trials.json)) listing all clinical trials, 
a wrapper is built around it.

**time tracking**: ~3h including
  - project understanding, in-depth technical training about `yarn berry`, time to take decisions
  - design decisions: 
    - creation of a `business` package to separate concerns in the project and better dependency management:
      business should not depend on infrastructure choices
    - definition of `ports` interfaces defining the business needs to be fulled implemented
    - implementation of a specific `adapter` more than a fake waiting to an actual implementation using the third-party API.
  - technical decisions:
    - using the built-in `node` test runner: no need to add dependencies, quick to run test, the desire to try something new 😉
    - using `node` with `esbuild` to use `node` test runner
    - using `factory.ts`, `faker` and `sinon` to ease the tests


Pull Request #2: ♻️ Improve get ongoing trials use case
---------------
**description**: To ensure data consistency and simplify the `repository` `port` implementation, clinical trial filtering
is done in the use case instead of the repository adapter.

**time tracking**: ~1h \
During the api implementation, difficulties in testing have emerged. With the current implementation,
inconsistent data was returned by the GetOngoingClinicalTrials use case. The decision was made to put the
filtering implementation in the use case itself.


Pull Request #3: ✨Get ongoings api
---------------
**description**: Add the `/on-goings` route on the server API that returns the _ongoing_ clinical trials.
This route accepts `sponsor` and `country` query params to filter the supplied clinical trials.
This implementation uses the `findClinicalTrials` "fake" adapter provided by the `business` package.
It could be replaced by a real implementation using a third-party API later.

**time tracking**: ~3h including
  - decision to duplicate test utilities to save time, a test-utilities package could be defined later
  - use `supertest` to ease the api tests from the routes themselves
  - use `express-validator` to check the request validity


Pull Request #4: 📝  Performance checking documentation
----------------

**description**: Introduction of the [performance-checkin](performance-checkin.md) file containing a brief description
of each pull request and a rough estimate of the time spent to achieve it.

**time tracking**: ~1h including each PR definitions


Pull Request #5: ✨ Improve clinical trials api serialization
----------------

**description**: Instead of returning only the country code, it seems better to return the code and the country's name
to avoid extra manipulations later.

**time tracking**: ~1h


Pull Request #6: ✨ Implement a `cli`
----------------

**description**: This is the `inato-cli` command-line interface that displays the list of ongoing clinical trials 
for a given country code.
It calls the web server API that is running locally on the user's computer.

**time tracking**: ~2h
