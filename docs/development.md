# Development guideline

## Environment setup
Here is how to setup the development environment:
1. Setup the project by first installing the dependencies `npm install`
2. Write code and tests
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## CI Blackbox testing
In each PR there will be running a CI pipeline which ensures that this [dummy.json](../test/CI-blackbox/dummy.yml) file can produce a valid output file. This means all generated models will be written to a single output file and then transpiled/compiled depending on the output language. 

So if any of those CI jobs fail this is how to reproduce what the CI sees.

For each output language (`ts`, `js`, `java`) there will be the following scripts:
1. `ci:blackbox:<language>:generate` which generates the output
1. `ci:blackbox:<language>:test` which tests the output file, currently we only test that the file is syntactically correct.
1. `ci:blackbox:<language>` runs both of the previous scripts

### Requirements
To be able to run the `java` CI script you need to have JDK installed.

To be able to run the `ts` CI script you need to have Typescript installed `npm install -g typescript`.