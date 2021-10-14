# Contributing to Modelina

First of all thank you :bow: for considering to contribute to this library, we can use all the help we can get!

This contribution guide is an extension to the core contributing guide that can be found [here](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md). Make sure you go through that beforehand. 

## Acceptance Criteria for PR's

Even though we love contributions, we need to keep a level of standard in what is merged into the code base. Below you will find information about what the acceptance criteria is, based on the contribution you are making.

### Acceptance Criteria For Fixing Bugs 

Fixing any bug, means that you should be able to reproduce the error using tests that will fail unless the fix is implemented.

### Acceptance Criteria For New Features

Any new features require a few things to be accepted. This is to ensure that a feature is well described and implemented before released. 

1. An accepted feature request from the community (and maintainers). Even though you are welcome to create the feature without an issue, it might be rejected, and it would be a waste of your time, and we don't want that to happen!
1. Tests that cover the new feature in depth. Try and aim for as high coverage numbers as possible.
1. No documentation no feature. If users are not enlighten of the new features, they don't exist, so make sure that any relevant [documentation](./) is updated.
    - New features such as new presets, generators or inputs, etc, need associated use-case documentation along side [examples](../examples) to not only showcase the feature, but ensure it will always work. Checkout [adding examples](#-adding-examples) for more information how to do this.

#### Adding Examples
Examples is not only something we use to showcase the features, but ensure those features will always work, as it is picked up by [our CI system](#What-does–the-CI-system-do-when-I-create-a-PR). 

Adding examples is quite straight forward, so don't be alarmed! Here is how you do it:
1. Duplicate the [TEMPLATE folder](https://github.com/asyncapi/modelina/tree/master/examples/TEMPLATE) and rename it to what it revolves around. If you can't think of anything suiting, just go with your first thought, we can always discuss it in the PR afterwards.
1. Rename the following [package configuration](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/package.json#L2) to the same name as the directory.
1. Adapt the [source code example](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/index.ts) to reflect the use-case.
1. Adapt the [testing file](https://github.com/asyncapi/modelina/blob/1e71b3b2cab6bc2c277001fcafe7e1b8ed175ce9/examples/TEMPLATE/index.spec.ts#L4) to the use-case. In most cases it would be as simple as changing the title of the test, nothing else.

Aaaand you are done :tada:

## FAQ
Below is some further information about different corners of contributing.

### Can I solve issues not labeled "good first issue"?

Absolutely!

Regular issues are generally not that well described in terms of what need to be accomplished, and require some internal knowledge of the internals of the library. However!

If you find an issue you would like to solve, ping one of the maintainers, and they can help you get started. It is not that we don't want to provide help, it just takes more effort to solve the issue, that what might be easily described.


### What does the CI system do when I create a PR?
The CI system is quite complex and you don't need to know any in depth details as a general contributor, but here is the general rundown that is run on each PR:

- We inherit all the [AsyncAPI core GitHub workflows](https://github.com/asyncapi/.github/tree/master/.github/workflows), which gives the most important one:
    - [A standard PR workflow](https://github.com/asyncapi/.github/blob/master/.github/workflows/if-nodejs-pr-testing.yml) which ensures that the following commands need to succeed: `npm run test`, `npm run lint`, and `npm run generate:assets`.
- [BlackBox testing](https://github.com/asyncapi/modelina/tree/master/test/blackbox) has it's [own workflow](https://github.com/asyncapi/modelina/blob/master/.github/workflows/blackbox-testing.yml) which ensures that all supported inputs generate syntactically correct outputs to any of the output languages. This check does take a while (usually +5 minutes). Generally, you don't need to worry about this one, unless the code all of the sudden generate syntactically incorrect code (we will guide you if it happens). 
- [Coverall](https://github.com/asyncapi/modelina/blob/master/.github/workflows/coverall.yml) ensure that we get the test coverage statistics in each PR, ensuring we can see how it affects the overall test coverage. It will create a comment to the PR with the coverage status.
- [SonarCloud](https://sonarcloud.io/dashboard?id=asyncapi_generator-model-sdk) code analysis is run to ensure that there are no bugs, security concerns, code smells or duplicated code blocks. Make sure you address any concerns found by this bot, it will generate a comment to the PR if there is any.

Sometimes checks just fail, based on some weird dependency problems, if any occur that does not look like a problem you can fix, just tag one of the maintainers, we are there to help :smile:
