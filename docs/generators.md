# Generators

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generator's options](#generators-options)
  * [TypeScript](#typescript)
    + [Generator options](#generator-options)
    + [Render complete model options](#render-complete-model-options)
  * [Java](#java)
    + [Generator options](#generator-options-1)
    + [Render complete model options](#render-complete-model-options-1)
  * [JavaScript](#javascript)
    + [Generator options](#generator-options-2)
    + [Render complete model options](#render-complete-model-options-2)
  * [Go](#go)
    + [Generator options](#generator-options-3)
    + [Render complete model options](#render-complete-model-options-3)
  * [C#](#c%23)
    + [Generator options](#generator-options-4)
    + [Render complete model options](#render-complete-model-options-4)
- [Custom generator](#custom-generator)

<!-- tocstop -->

**Generators** are classes that are used to render models for a given language.

## Generator's options

For Modelina, there exist 3 types of options for the generation process.
1. Default options, are the default options the rest overwrite.
2. Generator options, are used as the baseline that is by default used for each model render.
3. Render options, are the last resort to specialize options for the individual rendering of a model, that overwrite the generator options.

Generator options are passed as the first argument to the generator's constructor. Check the example:

```ts
const generator = new TypeScriptGenerator({ ...options });
```

Render options are passed as the first argument to the generator's render function. Check the example:

```ts
const generator = ...
const model = ...
const inputModel = ...
generator.render(model, inputModel, { ...options });
```

Default generator options (common to all generators) are as follows:

| Option | Type | Description | Default value |
|---|---|---|---|
| `indentation` | Object | Options for indentation ([example](../examples/indentation-type-and-size)). | - |
| `indentation.type` | String | Type of indentation. Its value can be either `SPACES` or `TABS` and are typed by `IndentationTypes`| `SPACES` |
| `indentation.size` | String | Size of indentation. | 2 |
| `defaultPreset` | Object | Default preset for generator. For more information, read [customization](./presets.md) document. | _Implemented by generator_ |
| `presets` | Array | Array contains **presets**. For more information, read [customization](./presets.md) document. | `[]` |

In addition, generators take additional options when calling their `renderCompleteModel(input, options)` functions.
This allows the caller to specify additional options when generating a multi-file model from the input with cross dependencies.

Below is a list of additional options available for a given generator.

### [TypeScript](./languages/TypeScript.md)

#### Generator options

| Option | Type | Description | Default value |
|---|---|---|---|
| `renderTypes` | Boolean | Render signature for types. | `true` |
| `mapType` | String |  It indicates which mapping type should be rendered for the `object` type. Its value can be one of `map`, `record` or `indexedObject`. | `map` |
| `modelType` | String | It indicates which model type should be rendered for the `object` type. Its value can be either `interface` or `class`. | `class` |
| `enumType` | String | It indicates which type should be rendered for the `enum` type. Its value can be either `union` or `enum`. | `enum` |
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords for TS, as well as JS to ensure painless transpilation_ |

#### Render complete model options

| Option         | Type                     | Description                                                                | Default value |
|----------------|--------------------------|----------------------------------------------------------------------------|---------------|
| `moduleSystem` | 'ESM' &#124; 'CJS'       | Which module system the generated files should use (`import` or `require`) | 'CJS'         |
| `exportType`   | 'default' &#124; 'named' | Whether the exports should be default or named exports                     | 'default'     |

### [Java](./languages/Java.md)

#### Generator options

| Option | Type | Description | Default value |
|---|---|---|---|
| `collectionType` | String | It indicates with which signature should be rendered the `array` type. Its value can be either `List` (`List<{type}>`) or `Array` (`{type}[]`). | `List` |
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

#### Render complete model options

| Option        | Type   | Description                                   | Default value |
|---------------|--------|-----------------------------------------------|---------------|
| `packageName` | string | The package name to generate the models under | [required]    |

### [JavaScript](./languages/JavaScript.md)

#### Generator options

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered_ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

#### Render complete model options

| Option         | Type                     | Description                                                                | Default value |
|----------------|--------------------------|----------------------------------------------------------------------------|---------------|
| `moduleSystem` | 'ESM' &#124; 'CJS'       | Which module system the generated files should use (`import` or `require`) | 'CJS'         |

### [Go](./languages/Go.md)

#### Generator options

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name_ |
| `namingConvention.field` | Function | A function that returns the format of the field. | _Returns pascal cased name_ |

#### Render complete model options

| Option        | Type   | Description                                   | Default value |
|---------------|--------|-----------------------------------------------|---------------|
| `packageName` | string | The package name to generate the models under | [required]    |

### [C#](./languages/Csharp.md)

#### Generator options

| Option | Type | Description | Default value |
|---|---|---|---|
| `namingConvention` | Object | Options for naming conventions. | - |
| `namingConvention.type` | Function | A function that returns the format of the type. | _Returns pascal cased name, and ensures that reserved keywords are never rendered__ |
| `namingConvention.property` | Function | A function that returns the format of the property. | _Returns camel cased name, and ensures that names of properties does not clash against reserved keywords_ |

#### Render complete model options

| Option      | Type   | Description                                | Default value |
|-------------|--------|--------------------------------------------|---------------|
| `namespace` | string | The namespace to generate the models under | [required]    |

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
