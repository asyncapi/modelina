# Generators

**Generators** are classes that are used to render models for a given language.

## Supported languages

- [JavaScript](../src/generators/javascript/JavaScriptGenerator.ts),
- [TypeScript](../src/generators/typescript/TypeScriptGenerator.ts),
- [Java](../src/generators/java/JavaGenerator.ts).
- [Go](../src/generators/go/GoGenerator.ts).
- [C#](../src/generators/csharp/CSharpGenerator.ts).

## Generator's options

Each generator extends default options for the generator. It means that the generator can also have additional options.

Options are passed as the first argument to the generator's constructor. Check the example:

```ts
const generator = new TypeScriptGenerator({ ...options });
```

Default options contain:

| Option | Type | Description | Default value |
|---|---|---|---|
| `indentation` | Object | Options for indentation. | - |
| `indentation.type` | String | Type of indentation. Its value can be either `SPACES` or `TABS`. | `SPACES` |
| `indentation.size` | String | Size of indentation. | 2 |
| `defaultPreset` | Object | Default preset for generator. For more information, read [customization](./customization.md) document. | _Implemented by generator_ |
| `presets` | Array | Array contains **presets**. For more information, read [customization](./customization.md) document. | `[]` |

Below is a list of additional options available for a given generator.

### [TypeScript](../src/generators/typescript/TypeScriptGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `renderTypes` | Boolean | Render signature for types. | `true` |
| `modelType` | String | It indicates which model type should be rendered for the `object` type. Its value can be either `interface` or `class`. | `class` |
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords for TS, as well as JS to ensure painless transpilation_ |

### [Java](../src/generators/java/JavaGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `collectionType` | String | It indicates with which signature should be rendered the `array` type. Its value can be either `List` (`List<{type}>`) or `Array` (`{type}[]`). | `List` |
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

### [JavaScript](../src/generators/javascript/JavaScriptGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered_ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

### [Go](../src/generators/javascript/GoGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name_ |
| `namingConvention.field` | Function | A function that returns the format of the field. | _Returns pascal cased name_ |

### [C#](../src/generators/csharp/CSharpGenerator.ts)

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

## Custom generator

The minimum set of required actions to create a new generator are:

- Source code must be included in [generators](../src/generators) folder.
- Must extend the abstract [`AbstractGenerator`](../src/generators/AbstractGenerator.ts) class,
- Must define [`Preset`](./customization.md)'s shape for the language,
- Must define language options by passing an interface describing additional options to the first generic argument of [`AbstractGenerator`](../src/generators/AbstractGenerator.ts). The interface must also be extended by `CommonGeneratorOptions` interface,
- Must define default options as static class's field, which must be extended by `defaultGeneratorOptions`,
- Default options must include `defaultPreset` property,
- Must implement `render` function,
- Must define **Renderers** classes for available model types in a given language. **Renderer** is an instance of the class with common helper functions to render appropriate model type and must be extended by [`AbstractRenderer`](../src/generators/AbstractRenderer.ts) class - [example](../src/generators/typescript/renderers/ClassRenderer.ts).

Check the [generator implementation](../src/generators/typescript/TypeScriptGenerator.ts) for `TypeScript` language to see how it should look like.

If you created a generator then you can contribute it to the AsyncAPI Model SDK and it will become the official supported generator.
