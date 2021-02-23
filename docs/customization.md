# Customization

The AsyncAPI Model SDK uses **presets** to extend the rendered model.

## Preset

**Preset** is a pure JavaScript object with format `key: value`, where `key` is a name of model type and `value` is another object which contains methods, which extend a given rendered part for a given model type, like below example:

```js
{
  // `class` model type 
  class: {
    self(...options) {
      // logic
    },
    // `setter` customization method 
    setter(...options) {
      // logic
    }
  },
  interface: {
    property(...options) {
      // logic
    }
  },
}
```

Each language has different model types, which results in different implementable methods in a single preset. For more information, please check the [available preset's shape](#presets-shape) section.

## Custom preset

Below is a custom preset written for TypeScript language, which adds a description to each interface's property and to self as a comment.

```ts
import { TypeScriptGenerator } from '@asyncapi/generator-model-sdk';

function renderDesc({ renderer, content, model }) {
  const desc = model.getFromSchema('description');
  if (desc) {
    const renderedDesc = renderer.renderComments(desc);
    return `${renderedDesc}\n${content}`;
  }
  return content;
}

const DESCRIPTION_PRESET = {
  interface: {
    self({ renderer, content, model }) {
      return renderDesc({ renderer, content, model });
    },
    property({ renderer, model, content }) {
      return renderDesc({ renderer, content, model });
    }
  }
}

const generator = new TypeScriptGenerator({ modelType: 'interface', presets: [DESCRIPTION_PRESET] });

const schema = {
  $id: "Address",
  type: "object",
  description: "Address information",
  properties: {
    street_name:    { type: "string" },
    city:           { type: "string", description: "City description" },
  },
  required: ["street_name", "city"],
};

const models = await generator.generate(schema);

// models[0] should have the shape:
/**
 * Address information
 */
interface Address {
  streetName: string;
  /**
   * City description
   */
  city: string;
}
```

Note that in the `DESCRIPTION_PRESET` object, we first defined which model we want to extend - in our case it's the `interface` - and then we implemented the `self` method, which extends the whole model shape and `property` method, which only extends that part of the model - property for the interface.

For each custom preset, the implementation of methods for a given model type is optional. It means that you can implement only one, needed by your case extension for the given model type, as in the above example.

The order of extending a given part of the model is consistent with the order of presets in the array passed as a `presets` option parameter in the generator's constructor.

The user has the possibility to pass options to the custom preset - if preset has defined options - used in a `presets` array. To do that, please pass as an array's element an object with the `preset` field as a reference to the custom preset and define the `options` field with options passed to the preset. Check example:

```js
const generator = new TypeScriptGenerator({ presets: [
  SOME_PRESET, 
  {
    preset: PRESET_WITH_OPTIONS,
    options: {...},
  },
] });
```

## Overriding the default preset

Each implemented generator for appropriate language must have defined the default preset. However, we can override it by passing it as the `defaultPreset` parameter in the generator options. Check the example for TypeScript generator:

```js
const DEFAULT_PRESET = {
  // implementation
}

const generator = new TypeScriptGenerator({ defaultPreset: DEFAULT_PRESET });
```

> **NOTE**: Each default preset must have implemented each method for a given model type. Keep this in mind when overriding the default preset.

## Preset's shape

By each preset user can implement two basic methods:

- `self` - the method for extending the whole model shape.
- `additionalContent` - the method which adds additional content to model.

For each customization method, the given argument is passed.

Below is a list of supported languages with the shape of the preset for a given model type.

### Java

#### Class

| Method | Description | Arguments |
|---|---|---|---|
| `self` | Main method for render the model shape. |  | [The generator instance](https://github.com/asyncapi/generator/blob/master/docs/api.md)
| `enum` | Called at the very end of the generation. | void : Nothing is expected to be returned. | [The generator instance](https://github.com/asyncapi/generator/blob/master/docs/api.md)