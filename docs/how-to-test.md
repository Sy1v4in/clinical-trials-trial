# How to run it?

## As a developer

As a developer, you have to clone this repository and install node. You can use `nvm` and the
`.nvmrc` file at the root of the project to use the right node version.
Once `node` and `yarn` installed:
  - `cd packages/api`
  - call `yarn` to install the dependencies
  - call `yarn start` to run the web server

This web server will start on the port `8080`.

Once the webserver is started, you can open a new shell window on this project and:
  - `cd packages/cli`
  - call `yarn` to install the dependencies

You can then use `yarn start` to run the `cli` script.
This script makes http calls to the local web server previously started.
To know the options of this cli, use the --help arguments:

```shell
> yarn start --help
Usage: inato-cli trials [options]

get the list of ongoing clinical trials

Options:
  -p, --path <type>             the api path to call (default: "on-goings")
  -s, --sponsor <sponsor name>  the sponsor name of the clinical trials
  -c, --country <country code>  the country code where the clinical trials are being conducted
  -h, --help                    display help for command
```
For instance, if you want to display the clinical trials for the sponsor "Sanofi", just write
```shell
> yarn start --sponsor Sanofi
```

## As a simple user

As a simple user, you can use node and npm locally to install scripts that come from npm repository.
One step is then missing here: generate a build of the project and publish it on a `npm` repository by exporting
the 2 main scripts: 
  - `inato-server`: `packages/api/dist/src/index.js`
  - `inato-cli`: `packages/cli/dist/src/index.js`

By installing this project globally on its machine, a care agent will then be able to access these scripts and use them
in exactly the same way as described in the previous paragraph.
