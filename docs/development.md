# Development guideline
These are some of the development guidelines and help to setup the library for development.

## Environment setup
To setup the environment follow these steps:
1. Setup the project by first installing the dependencies `npm install`
1. Make sure the tests pass by running `npm run test` script
    - [blackbox testing](##Blackbox-testing) are excluded when running the `test` script because it require some extra setup.
1. Make sure code is well formatted and secure `npm run lint`

## Blackbox testing
The blackbox testing have some different requirements in order to successfully run:
- To to run the `java` blackbox tests, you need to have JDK installed.
- To to run the `ts` blackbox tests, you need to have TypeScript installed globally - `npm install -g typescript`.

By default the blackbox tests are not run with the regular `npm run test`, but can be run with `npm run test:blackbox`.
