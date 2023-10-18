# Integrate Modelina into Maven

This Java Maven project shows an example how to integrate Modelina and AsyncAPI into your build process. 

Here is how it works:
- The script `./scripts/modelina/generate.ts` is what generates all the models, and what Maven uses to generate the models. This can also be executed manually through `npm run generate`.
- The input, in this case, is an AsyncAPI document located in the root of the project `./asyncapi.json`. The input can be anything, just alter the generator script.
- The Maven project file `./pom.xml` then utilizes the [frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) to execute the generate script on build so you will always have the up to date models from your AsyncAPI document.

> NOTICE: The only thing you manually have to change for this to work in your project is the dependency entry for `"@asyncapi/modelina": "file:../../../../",` in the `./scripts/modelina/package.json` file to use the latest Modelina version (we only use a local one for testing purposes).