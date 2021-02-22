# Customization

The AsyncAPI Model SDK uses **presets** to extend rendered model.

## Preset

**Preset** is a JS object with format `key: value`, where key is a name of model type and value is an another object which contains methods, which extend a given part for a given model type. Each language has different model types, which results in different implementable methods in a single preset.

### Custom preset

Below is a custom preset written for TypeScript language, which adds a description to each property as a comment in interface.

```ts
import { TypeScriptGenerator } from '@asyncapi/generator-model-sdk';

const DESCRIPTION_PRESET = {
  interface: {
    property({ renderer, model, content }) {
      const desc = model.getFromSchema('description');
      if (desc) {
        const renderedDesc = renderer.renderComments(desc);
        return `${renderedDesc}\n${content}`;
      }
      return content;
    }
  }
}

const generator = new TypeScriptGenerator({ modelType: 'interface', presets: [DESCRIPTION_PRESET] });

const schema = {
  $id: "Address",
  type: "object",
  properties: {
    street_name:    { type: "string" },
    city:           { type: "string", description: "City description" },
  },
  required: ["street_name"],
};

const models = await generator.generate(schema);

// models[0] should have the shape:
interface Address {
  streetName: string;
  /**
   * City description
   */
  city?: string;
}
```

Note that in the `DESCRIPTION_PRESET` object, we first defined which model we want to extend - in this case it's the interface - and then we implemented the `property` method, which only extends that part of the model - property for the interface.

For each custom preset, the implementation of methods for a given model type is optional. This means that you can implement only one, needed by your case extension for the given model type, as in the above example.

The order of extending a given part of model is consistent with the order of presets in the array passed as an `presets` option parameter in the generator's constructor.

### Overriding the default preset

Each implemented generator for appropriate language must have defined the default preset. However, we can override it by passing it as the `defaultPreset` parameter in the generator options. Check the example for TypeScript generator:

```ts
const DEFAULT_PRESET = {
  // implementation
}

const generator = new TypeScriptGenerator({ defaultPreset: DEFAULT_PRESET });
```

> **NOTE**: Each default preset must have implemented each method for given model type. Keep this in mind when overidding the default preset.
