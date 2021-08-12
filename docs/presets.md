# Presets

The AsyncAPI Model SDK uses **preset** objects to extend the rendered model.

A **preset** is a pure JavaScript object with format `key: value`, where `key` is the name of a model type and `value` is an object containing methods that extend a given rendered part for a given model type, like below example:

```js
{
  // `class` model type 
  class: {
    self(...options) { /* logic */ },
    // `setter` customization method 
    setter(...options) { /* logic */ },
  },
  interface: {
    // `property` customization method 
    property(...options) { /* logic */ },
    additionalContent(...options) { /* logic */ },
  },
}
```

Each language has different model types, which results in different implementable methods in a single preset. For more information, please check the [preset's shape](#presets-shape) section.

## Custom preset

Below is a custom preset written for TypeScript language, which adds a description to each interface's property and to the model itself as a JavaScript comment.

```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';

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

## Adding new dependencies

Each preset hook has the possibility of adding its own dependencies that needs to be rendered for the given model. It can be done through the `addDependency` function from `renderer` property.

```ts
...
self({ renderer, content }) {
  renderer.addDependency('import java.util.*;');
  return content;
}
...
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

For each model type, you can implement two basic methods:

- `self` - the method for extending the model shape.
- `additionalContent` - the method which adds additional content to the model.

Each customization method receives the following arguments:

- `model` - an instance of the [`CommonModel`](../src/models/CommonModel.ts) class, which described rendered data model.
- `inputModel` - an instance of the [`CommonInputModel`](../src/models/CommonInputModel.ts) class.
- `renderer` - an instance of the class with common helper functions to render appropriate model type.
- `content` - rendered content from previous preset.
- `options` - options passed to preset defined in the `presets` array.

Below is a list of supported languages with their model types and corresponding additional preset's methods with extra arguments based on the character of the customization method.

### Java

#### **Class**

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `setter` | A method to extend setter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `getter` | A method to extend getter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |

#### **Enum**

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | an `item` containing the value of enum's item. |

### JavaScript

#### **Class**

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `setter` | A method to extend setter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `getter` | A method to extend getter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |

### TypeScript

#### **Class**

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `setter` | A method to extend setter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `getter` | A method to extend getter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |

#### **Interface**

| Method | Description | Additional arguments |
|---|---|---|
| `property` | A method to extend rendered given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |

#### **Enum**

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | an `item` containing the value of enum's item. |

#### **Type**

There are no additional methods.

### Go

#### **Struct**

| Method | Description | Additional arguments |
|---|---|---|
| `field` | A method to extend rendered given field. | `fieldName` as a name of a given field, `field` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |


### C#

#### **Class**

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `setter` | A method to extend setter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |
| `getter` | A method to extend getter for a given property. | `propertyName` as a name of a given property, `property` object as a [`CommonModel`](../src/models/CommonModel.ts) instance. |

#### **Enum**

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | an `item` containing the value of enum's item. |
