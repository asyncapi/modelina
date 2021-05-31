# Development guideline

## Environment setup
Here is how to setup the development environment:
1. Setup the project by first installing the dependencies `npm install`
2. Write code and tests
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## Blackbox testing
The blackbox testing have some different requirements in order to successfully run:
- To to run the `java` blackbox tests, you need to have JDK installed.
- To to run the `ts` blackbox tests, you need to have TypeScript installed `npm install -g typescript`.

By default the blackbox tests are not run with the regular `npm run test`, but can be run with `npm run test:blackbox`.