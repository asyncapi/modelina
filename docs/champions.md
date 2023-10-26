<p align="center">
  <img src="https://i.giphy.com/media/3ohs4Az5xSJj0RYrss/giphy.webp" width="300" height="300"/>
</p>

# Mission

Modelina aims to be the number one library for generating models, allowing full customization to the user to forge their models from minimalist models to their hearts desire. We don't assume we know what all the users wants, we enable them to decide for themself.

# Champions

As Modelina grows, more and more people would like to become maintainers, each with varying degree of time to give.

In order to have something for everyone, we introduce the concept of `champions` where we split up the areas of responsibility where best possible. Champions will have the ability to merge and accept pull requests for their [area of responsibility](#areas-of-responsibility), basically owning and maintaining a part of Modelina. This also entitles you to join the [AsyncAPI TSC](https://www.asyncapi.com/community/tsc).

You can checkout the [CODEOWNERS file](../CODEOWNERS) for an updated list of maintainers and what areas they champion.

## Areas of responsibility

These are the areas that we mainly focus on getting having champions and where you can help out. However, keep in mind it is not limited to these alone.

### :running: Core champions

There is not one area that interest you, but rather the library as a whole, where you want to maintain and push forward the project and it's mission.

### :books: Doc champions

Doc champions are those who focus on the documentation and how users best go from 0 to 100 in order to use Modelina. Maybe you like to write technical documentation, or you love making tutorials, this would be for you!

### :trident: Input champions

Input champions are those who take charge of the input processing, it can either be a specific input processor (such as JSON Schema or AsyncAPI) or multiple. They maintain the process of converting the input to the internal model which Modelina can use to generate outputs to.

### :wrench: Language champions

Language champions are those who maintain of a specific language output, it can either be a specific generator (such as TypeScript or Java) or or multiple. They maintain the process of converting the internal model into usable data models in their respective language.

### :sparkles: Website champions

Website champions are those who focus on the website (this includes playground). Maybe you are a designer or coder that loves to create great interactions for user, then this is would be for you!

## Becoming a champion

There can be many ways to become a champion, but what they all have in common is regularly contributing to the project. There is no limit to who or how many can become champions of a specific area and you can also become champion of multiple areas.

### How to get started

The first step is always to get to know the tool, explore how and what it does. If you like to make your own side projects, try using Modelina and as you find issues, raise them and maybe even solve them. You can also look for [good first issues](https://github.com/asyncapi/modelina/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22), that are well described issues tailored for new contributors.

As you become more and more familiar with the project and continue to contribute, naturally you become a champion, like two rivers merging.

# Champion Guidelines

The guidelines are highly inspired by [the Brew Maintainer Guidelines](https://docs.brew.sh/Maintainer-Guidelines).

This section are meant to serve as guiding principles for champions and what the privilege entitles. Remember, as a team we **Prioritise Champions Over Users** to avoid burnout.

If you wish to change or discuss any of the champion guidelines: open a PR to suggest a change, or create an issue detailing the change you wish to see.

## Reviewing a PR

To ensure a certain level of quality all champions must make sure the following is uphold before accepting a PR:

1. All **required** CI checks MUST pass. Unless a specific reason is given it should not.
2. The PR must add or adapt the documentation where applicable. No feature should exist without documentation.
3. If it's a new feature, a new example MUST be added. No feature should exist without examples.
4. The PR should include tests where possible. No feature should exist without tests.
5. Make sure that [Versioning and maintenance](#Versioning-and-maintenance) is uphold.

### Merging a PR

There are a few ways to merge a PR, depending on whether your are a champion or contributor.

Any champion can merge any PR they have carefully reviewed and is passing CI that has been opened by another champion. If you do not wish to have other champions merge your PRs: please use the do not merge label (or the command `/dnm`) to indicate that you will personally merge it when it's ready.

One of the issues for champions is that it normally require a review from another champion for their change to be merged, and this can create a huge delay unless there is enough champions to share the workload.

Therefore we enforce **Lazy consensus** when it comes to features and changes to the project.

#### Merging without review

Merging without having another champion review your code, require a special set of requirements to be met before allowed to do so. They are as follows:

- Must do a self review following [Reviewing a PR](#Reviewing-a-PR).
- Must give other champions adequite time to check your code, at least 5 days (120 hours after review was requested). Exceptions: this do not apply for PR that changes documentation, the website, examples, CI, or tests.

If a champion is on holiday/vacation/sick during this time and leaves comments after they are back: please treat post-merge PR comments and feedback as you would if left within the time period and follow-up with another PR to address their requests (if agreed).

## Versioning and maintenance

As of version 1, Modelina has a very strict set of changes we are allowed to do before it requires a major version change. In short, any changes that change the generated outcome are not allowed as it's a breaking change for the consumer of the generated models.

Here is a list of changes we are allowed to do that would not require a breaking change:

- Adding new features (that do not change existing output), such as generators, presets, input processors, etc.
- Change existing features, by providing options that default to current behavior. This could be a preset that adapts the output based on options, as long as the API of Modelina and the API of the generated models does not have any breaking changes.
- Bug fixes where the generated code is otherwise unusable (syntax errors, etc).

Breaking changes are allowed and expected at a frequent rate, of course where it makes sense we will try to bundle multiple changes together.

We of course will do our best to uphold this, but mistakes can happen, and if you notice any unintended breaking changes please let us know!

Because of the number of the limited number of champions, only the most recent major version will be maintained.

Major versions are currently happening at a 3-month cadence (in a similar fashion as the AsyncAPI specification), this will happen in January, April, June, and September, but not necessarily.

## Communication

Maintainers have a variety of ways to communicate with each other:

- Modelina's repository on GitHub
- Private communications between one or more champions on private channels (e.g. Slack)
- AsyncAPI Slack tooling channel

All communication should ideally occur in public on GitHub or the AsyncAPI Slack tooling channel. Where this is not possible or appropriate (e.g. a security disclosure, interpersonal issue between champions, urgent breakage that needs to be resolved) this can move to champions’ private group communication and, if necessary, 1:1 communication.

Technical decisions should not happen in 1:1 communications but if they do (or did in the past) they must end up back as something linkable on GitHub. For example, if a technical decision was made a year ago on Slack and another champions/contributor/user asks about it on GitHub, that’s a good chance to explain it to them and have something that can be linked to in the future.

This makes it easier for other champions, contributors and users to follow along with what we’re doing (and, more importantly, why we’re doing it) and means that decisions have a linkable URL.

All champion communication through any medium is bound by Modelinas Code of Conduct. Abusive behaviour towards other champions, contributors or users will not be tolerated; the champion will be given a warning and if their behaviour continues they will be removed as a champion.

Maintainers should feel free to pleasantly disagree with the work and decisions of other champions. Healthy, friendly, technical disagreement between champions is actively encouraged and should occur in public on the issue tracker to make the project better. Interpersonal issues should be handled privately in Slack, ideally with moderation. If work or decisions are insufficiently documented or explained any champion or contributor should feel free to ask for clarification. No champion may ever justify a decision with e.g. “because I say so” or “it was I who did X” alone. Off-topic discussions on the issue tracker, bike-shedding and personal attacks are forbidden.

## Stepping down as a champion

There can be countless reasons why you want to step down as a champion and it is entirely your provocative at any time.

To step down as a champion make a PR removing your name from the [CODEOWNERS file](../CODEOWNERS) and thats it :v:
