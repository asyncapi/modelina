# Development

These are some of the development guidelines and help to setup the library for development.

## Docker

A [Dockerfile](../Dockerfile) is provided and can be used for running test suites or any other command.
You can either build the image and run the needed commands manually or rather use any of the following npm scripts:

- `npm run docker:build` builds the docker image with the tag `asyncapi/modelina` (the rest of the scripts run this one as well).
- `npm run docker:test` runs the main test suite.

## Environment setup

To setup the environment follow these steps:

1. Make sure to use the appropriate node version as listed in the [package.json file](https://github.com/asyncapi/modelina/blob/ffc0cd8673791b262926093e381c17823fbe9565/package.json#L11). If you use `nvm`, you can simply do `nvm use`
2. Setup the project by first installing the dependencies `npm install`
3. Make sure the tests pass by running `npm run test` script
   - You can update snapshots by running `npm run test -- -u`
4. Make sure code is well formatted and secure with eslint by running `npm run lint`, you can also auto format your code with `npm run format`

