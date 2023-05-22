# BlackBox tests

As we start to integrate more and more inputs, we must test actual and real inputs from users to ensure the library behaves as expected. For now, the best way is to add them as BlackBox tests. The BlackBox tests are focused on catching syntax errors and not logical errors, although they can be manually used for this.

The documents being tested can be found under [docs](./docs), which contain documents for the following input types:
- [AsyncAPI 2.0](./docs/AsyncAPI-2_0)
- [AsyncAPI 2.1](./docs/AsyncAPI-2_1)
- [AsyncAPI 2.2](./docs/AsyncAPI-2_2)
- [AsyncAPI 2.3](./docs/AsyncAPI-2_3)
- [AsyncAPI 2.4](./docs/AsyncAPI-2_4)
- [AsyncAPI 2.5](./docs/AsyncAPI-2_5)
- [AsyncAPI 2.6](./docs/AsyncAPI-2_6)
- [JSON Schema draft 4](./docs/JsonSchemaDraft-4)
- [JSON Schema draft 6](./docs/JsonSchemaDraft-6)
- [JSON Schema draft 7](./docs/JsonSchemaDraft-7)
- [Swagger 2.0](./docs/Swagger-2_0)
- [OpenAPI 3.0](./docs/OpenAPI-3_0)

Each document is tested across all output languages and output will be written to `./output` folder in appropriate sub-folders, for easier access.

## Running the tests
The tests can either be run by installing all dependencies locally or running it through docker.

If you want to run the BlackBox tests locally, you have to install a couple of dependencies:
- To run the `Java` BlackBox tests, you need to have JDK installed.
- To run the `TypeScript` BlackBox tests, you need to have TypeScript installed globally - `npm install -g typescript`.
- To run the `C#` BlackBox tests, you need to have C# compiler installed globally. - https://www.mono-project.com/download/stable/
- To run the `Go` BlackBox tests, you need to have GoLang installed - https://golang.org/doc/install
- To run the `Python` BlackBox tests, you need to have python installed - https://www.python.org/downloads/
- To run the `PHP` BlackBox tests, you need to have PHP installed - https://www.php.net/downloads.php/
- To run the `Rust` BlackBox tests, you need to have rust installed - https://www.rust-lang.org/tools/install (if you are on mac you might also need to install xcode `xcode-select --install`)
- To run the `Kotlin` BlackBox tests, you need to have a JDK >= 8 as well as kotlinc installed - https://kotlinlang.org/docs/command-line.html
- To run the `C++` BlackBox tests, you need to have a GNU C++ compiler installed - https://gcc.gnu.org/install/

By default, the BlackBox tests are not run with the regular `npm run test`, but can be run with `npm run test:blackbox`. Or run individual BlackBox tests you can run the commands `npm run test:blackbox:${language}` where language is one of `csharp`, `go`, `java`, `javascript`, `python`, `php`, `rust`, `typescript`, etc.

To run the BlackBox tests through Docker, run the command `npm run docker:test:blackbox`.
