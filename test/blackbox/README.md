# BlackBox tests

As we start to integrate more and more inputs, it is important that we test actual and real inputs from users to ensure the library behaves as expected. For now, the best way is to add them as BlackBox tests. The BlackBox tests are focused on catching syntax errors and not logical errors, although they can be manually used for this.

The documents being tested can be found under [docs](./docs), which contain documents for the following input types:
- [AsyncAPI 2.0](./docs/AsyncAPI-2_0)
- [AsyncAPI 2.1](./docs/AsyncAPI-2_1)
- [JSON Schema draft 7](./docs/JsonSchemaDraft-7)

Each document is tested across all output languages and output will be written to `./output` folder in appropriate sub folders, for easier access.

## Running the tests
The tests can either be run by installing all dependencies locally, or running it through docker.

To run the BlackBox tests through Docker, run the command `npm run docker:test:blackbox`.

If you want to run the BlackBox tests locally, you have to install a couple of dependencies:
- To to run the `Java` BlackBox tests, you need to have JDK installed.
- To to run the `TypeScript` BlackBox tests, you need to have TypeScript installed globally - `npm install -g typescript`.
- To to run the `C#` BlackBox tests, you need to have C# compiler installed globally. - https://www.mono-project.com/download/stable/
- To to run the `Go` BlackBox tests, you need to have GoLang installed - https://golang.org/doc/install

By default, the BlackBox tests are not run with the regular `npm run test`, but can be run with `npm run test:blackbox`.
