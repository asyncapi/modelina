# Contributing to Modelina

First of all, thank you 🙇🏾‍♀️ for considering contributing to Modelina; it needs all the help it can get!

This contribution guide is an extension to the core contributing guide that can be found [here](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md). Please make sure you go through that beforehand. 🙂👍🏽

If you have any questions, are unsure how your use-case fits in, or want something clarified, don't hesitate to [reach out on slack](https://asyncapi.com/slack-invite), we are always happy to help out!

## Acceptance criteria and process

Even though we love contributions, we need to maintain a certain standard of what can be merged into the codebase. 

The below sections provide information about our acceptance criteria, based on the type of contribution you make.

### Fixing bugs 

The Acceptance Criteria for _fixing any bug_ means that you should be able to reproduce the error using tests that will fail, unless a fix is implemented.

### New features

The Acceptance Criteria for _adding new features_ requires a few things in order to be accepted. This ensures all features are well described and implemented before being released.

1. **Not all feature requests from the community (or maintainers!) are accepted:** Even though you are welcome to create a new feature without an issue, it might be rejected and turn out to be a waste of your time. We don't want that to happen, so make sure to create an issue first and wait to see if it's accepted after community discussion of the proposal.
1. **When creating tests for your new feature, aim for as high coverage numbers as possible:** When you run the tests (`npm run test`), you should see a `./coverage/lcov-report/index.html` file being generated. Use this to see in depth where your tests are not covering your implementation.
1. **No documentation, no feature:** If a user cannot understand a new feature, that feature basically doesn't exist! Remember to make sure that any and all relevant [documentation](./) is consistently updated.
    - New features such as new presets, generators or inputs, etc, need associated use case documentation along side [examples](../examples). This is not only to showcase the feature, but to ensure it will always work. Checkout our [adding examples](#adding-examples) doc for more information on how to do this.

### Adding examples
The Acceptance Criteria Process for _adding examples_ is not only something we use to showcase features, but also to ensure those features always work. _(This is important since it is picked up by [our CI system](#what-does–the-ci-system-do-when-i-create-a-pr).)_

Adding examples is quite straight forward, so don't feel shy! Here's how to do it:
1. Duplicate the [TEMPLATE folder](https://github.com/asyncapi/modelina/tree/master/examples/TEMPLATE) and rename it to something that makes sense for your feature. If you can't think of anything, feel free to go with your first thought, since we can always discuss it in the PR afterwards.
1. Rename the following [package configuration](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/package.json#L2) to the same name as your directory.
1. Adapt [this source code example](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/index.ts) to reflect your use case.
1. Adapt [this testing file](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/index.spec.ts#L4) for your use case. In most cases, it could be as simple as changing the title of the test!
1. Add your example to our overall list of [examples](https://github.com/asyncapi/modelina/blob/master/examples/README.md).

Aaaand you are done! 🎉

### Adding a new preset 
Presets are for when you want to customize the generated output, they work like middleware that layers on top of each other, you can read more [about presets here](./presets.md).

Here is how you add a new preset:
1. All presets are located under `src/generators/${language}/presets`, either duplicate an existing preset and adapt it or create an empty TypeScript file.
2. The preset file has the syntax:
```ts
export const LANGUAGE_MY_PRESET: LanguagePreset = {
  class: {
    // Add preset hooks here
  }, 
  // enum: {
    // Add preset hooks here
  // }
};
```
Replace `LANGUAGE` with the generator the preset is for (for example `TYPESCRIPT`), and replace `LanguagePreset` with the generator the preset is for (for example `TypeScriptPreset`). It is optional which models you add preset hooks for, i.e. you can add preset hooks for `enum` alongside for `class`, but it's not required. Each generator has a set of outputs you can change, read more [about the presets here](./presets.md).

3. Add your preset to the `src/generators/${language}/presets/index.ts` file.
4. Add an [example](#adding-examples) to showcase your new feature.
5. Add documentation to [the language docs](./languages/) that explain the use case and links to your new example.
6. In most cases you want to add specific tests for edge cases or simply to test the preset. To do this add a new test file in `test/generators/${language}/presets/MyPreset.spec.ts` and replace `MyPreset` with your preset name. Now add a test using the following syntax:
```ts
describe('LANGUAGE_MY_PRESET', () => {
  let generator: LanguageGenerator;
  beforeEach(() => {
    generator = new LanguageGenerator({ presets: [LANGUAGE_MY_PRESET] });
  });
  
  test('should render xxx', async () => {
    const input = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' },
      },
    };
    const models = await generator.generate(input);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
```
Remember to replace `LANGUAGE` and `Language` with the appropriate values.

Aaaand you are done! 🎉

### Adding a new input processor
Input processors are the translators from inputs to MetaModel (read more about [the input processing here](./input-processing.md)). 

Here is how you can add a new input processor:
1. Duplicate the [template input processor](../src/processors/TemplateInputProcessor.ts) and rename it to the input you are adding a processor for.
2. Adapt the `shouldProcess` function which is used to detect whether an input processor should process the provided input.
3. Adapt the `process` function which is used to convert the input into meta models.
4. Duplicate the [template input processor tests](../test/processors/TemplateInputProcessor.spec.ts) and rename it to the input you are adding a processor for.
5. Adapt the testing code based on your input and the expected MetaModel conversion.
6. [Export your input processor](../src/processors/index.ts)
7. Add your input processor as part of the [main input processor](../src/processors/InputProcessor.ts)
8. Add a [test for the main input processor](../test/processors/InputProcessor.spec.ts) to ensure that your input processor are accessed accordingly.

Thats it for the code and tests, now all that remains is docs and examples! 🔥
1. [Add a new example](#adding-examples) showcasing the new supported input.
2. Add the [usage example to the usage document](./usage.md).
3. Add the new supported input to the [main readme file](../README.md#features).

Aaaand you are done! 🎉

### Adding a new generator
Generators sits as the core of Modelina, which frames the core concepts of what you can generate. Therefore it's also no small task to create a new one, so dont get discourage, we are here to help you! 

To make it easier to contribute a new generator, and to avoid focusing too much of the internals of Modelina, we created a template generator to get you started. If you encounter discreprencies with the following guide or templates, make sure to raise it as an issue so it can be fixed!

#### Getting started

1. Start by copy/pasting the [template generator](../src/generators/template/) and [tests](../test/generators/template/) and rename it to your generator.
2. Search and replace within your new generator and test folder for `Template`, `template` and `TEMPLATE` and replace it with your generator name and match the cases. **Make sure you search and replace it with matching case**.
3. Replace the filenames `Template...` with your generator name.
4. Add your [generator to the generator index file](../src/generators/index.ts).

Now it's time to adapt the template into what ever it is you are generating:
1. Adapt the [constraint logic](../src/generators/template/constrainer) and the [type constraints](../src/generators/template/TemplateConstrainer.ts) based on what is allowed within your output. Read more about the constraint logic [here](./constraints.md).
2. Add all of the reserved keywords that the models must never generate in the [Constant file](../src/generators/template/Constants.ts).
3. Adapt/create the first renderers. The template by default include two renderers, one for rendering enums and one for classes, but you can create what ever renderers makes sense. For example in Rust it's not called class but struct, so therefore its called a `StructRenderer`.
4. Adapt the file generator and the rendering of the complete models to fit your generator.

An important note about presets, they are used to extend and build upon the default model, the bare minimum of a data model, so that Modelina can support multiple features. You can read more about [presets here](./presets.md). If you have any questions or want something clarified, don't hesitate to [reach out on slack](https://asyncapi.com/slack-invite).

Time to adapt the tests, cause without tests, it's just an empty promise. The test that is included in the template is really just placeholders, so make sure you adapt them accordingly to your code.
1. Add a mocked renderer in the [TestRenderers](../test/TestUtils/TestRenderers.ts) file.
2. Adapt the [constrainer tests](../test/generators/template/TemplateConstrainer.spec.ts) based on the output.
3. Adapt the [reserved keywords tests](../test/generators/template/Constants.spec.ts)
4. Adapt the [generator tests](../test/generators/template/TemplateGenerator.spec.ts)
5. Adapt the [renderer tests](../test/generators/template/TemplateRenderer.spec.ts)
6. Add your generator to the [FileGenerators test](../test/generators/FileGenerators.spec.ts) to ensure the models are accurately written to files.

Lastly, we need to adapt some of the docs to showcase your new awesome generator! Cause if the users cant find it, it dont exist.
1. Add your [generator specific documentation under languages](./languages/) and add it to the [list of generators](./README.md#languages)
2. Add your generator to the list of generators in the [main readme file](../README.md)
3. Add a basic [usage example to the usage documentation](./usage.md), you can see more about how to create [examples here](#adding-examples).

Aaaand that's it! As a rule of thumb, start small and slowly add more features, don't try to push everything into one PR, as it will take forever to review, code, and merge. 

PR's you can look to for guidance on how the process goes: 
- https://github.com/asyncapi/modelina/pull/818
- https://github.com/asyncapi/modelina/pull/863

## FAQs
Below are some of the typical questions we've received about contributing to Modelina.

### Can I solve issues not labeled "good first issue"?

Absolutely!

Regular issues are generally not that well described in terms of what needs to be accomplished and require some internal knowledge of the library internals.

If you find an issue you would like to solve, ping one of the maintainers to help you get started. Some issues may require a higher level of effort to solve than might be easily described within the issue, so don't feel shy to chat with us about individual issues. 😀

### What does the CI system do when I create a PR?
Because the CI system is quite complex, we've designed it so that individual contributors don't need to understand in depth details. 

That said, here is a general rundown on what's triggered by each PR:

- We inherit all [AsyncAPI core GitHub workflows](https://github.com/asyncapi/.github/tree/master/.github/workflows), including the most important one:
    - [A standard PR workflow](https://github.com/asyncapi/.github/blob/master/.github/workflows/if-nodejs-pr-testing.yml) which ensures that the following commands need to succeed: `npm run test`, `npm run lint`, and `npm run generate:assets`.
- [Coverall](https://github.com/asyncapi/modelina/blob/master/.github/workflows/coverall.yml) ensures we get test coverage statistics in each PR, thus ensuring we see how it affects overall test coverage. It creates a comment on the PR with the coverage status.
- [SonarCloud](https://sonarcloud.io/dashboard?id=asyncapi_generator-model-sdk) runs a code analysis to ensure no bugs, security concerns, code smells, or duplicated code blocks. Make sure you address any concerns found by this bot, because it generates a comment to the PR if it finds any issue.

At the end of the day, sometimes checks just fail, based on weird dependency problems. If any test failures occur that don't look like a problem you can fix, simply tag one of the maintainers. We're there to help! 😄
