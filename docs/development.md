# Development guideline
These are some of the development guidelines and help to setup the library for development.

## Docker
A [Dockerfile](../Dockerfile) is provided and can be used for running test suites or any other command.
You can either build the image and run the needed commands manually or rather use any of the following npm scripts:

- `npm run docker:build` builds the docker image with the tag `asyncapi/modelina` (the rest of the scripts run this one as well).
- `npm run docker:test` runs the main test suite.
- `npm run docker:test:blackbox` runs the blackbox test suite.

## Environment setup

To setup the environment follow these steps:
1. Setup the project by first installing the dependencies `npm install`
2. Make sure the tests pass by running `npm run test` script
    - [blackbox testing](#blackbox-testing) are excluded when running the `test` script because it require some extra setup. Please refer to [Blackbox testing section](#blackbox-testing) below.
    - You can update snapshots by running `npm run test:snapshots`
3. Make sure code is well formatted and secure `npm run lint`

## Blackbox testing
Please refer to [Docker section](#docker) above if you wanna run the tests directly in Docker without configuring anything extra on your machine. 
If you prefer to install all the dependencies locally, keep reading.

The blackbox testing have some different requirements in order to successfully run:
- To to run the `java` blackbox tests, you need to have JDK installed.
- To to run the `ts` blackbox tests, you need to have TypeScript installed globally - `npm install -g typescript`.
- To to run the `C#` blackbox tests, you need to have C# compiler installed globally. - https://www.mono-project.com/download/stable/

By default the blackbox tests are not run with the regular `npm run test`, but can be run with `npm run test:blackbox`.
