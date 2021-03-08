# Generators

**Generators** are classes that are used to render models for a given language.

## Supported languages

- [JavaScript](../src/generators/javascript/JavaScriptGenerator.ts),
- [TypeScript](../src/generators/typescript/TypeScriptGenerator.ts),
- [Java](../src/generators/java/JavaGenerator.ts).

## Generator's options

Each generator extends default options for the generator. It means that the generator can also have additional options.

Options is passed as first argument to generator's constructor. Check the example:

```ts
const generator = new TypeScriptGenerator({ ...options });
```

Default options contains:

| Option | Type | Description | Default value |
|---|---|---|---|
| `indentation` | Object | Options for indentation. | - |
| `indentation.type` | String | Type of indentation. Its value can be either `SPACES` or `TABS`. | `SPACES` |
| `indentation.size` | String | Size of indentation. | 2 |
| `defaultPreset` | Object | Default preset for generator. For more information, read [customisation](./customisation.md) document. | _Implemented by generator_ |
| `presets` | Array | Array contains **presets**. For more information, read [customisation](./customisation.md) document. | `[]` |

Below is a list with additional options available for a given generator.

### [TypeScript](../src/generators/typescript/TypeScriptGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `renderTypes` | Boolean | Renders or not signature for types. | `true` |
| `modelType` | String | It indicates which model type should be rendered for `object` type. Its value can be either `interface` or `class`. | `class` |

## Custom generator

Creating a new generator which will become a part of the officially supported languages in AsyncAPI Model SDK is pretty simple. The minimum set of required actions to create a new generator are:

- source code must be included in [generators](../src/generators) folder.
- must extend the abstract [`AbstractGenerator`](../src/generators/AbstractGenerator.ts) class,
- must define [`Preset`](./customisation.md)'s shape for the language,
- must define language options by passing an interface describing additional options to the first generic argument of [`AbstractGenerator`](../src/generators/AbstractGenerator.ts). The interface must also be extended by `CommonGeneratorOptions` interface,
- must define default options as static class's field, which must be extended by `defaultGeneratorOptions`,
- default options must include `defaultPreset` property,
- must implement `render` function,
- must define **renderer**s classes for available model types in a given language. **Renderer** is an instance of the class with common helper functions to render appropriate model type and must be extended by [`AbstractRenderer`](../src/generators/AbstractRenderer.ts) class - [example](../src/generators/typescript/renderers/ClassRenderer.ts).

Check the [generator implementation](../src/generators/typescript/TypeScriptGenerator.ts) for `TypeScript` language to see how it should looks like.
