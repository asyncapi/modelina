# Presets


Modelina uses something called **presets** to extend the rendered model. You can see it as layers you add ontop of each other which either adds new code to render, or completely overwrite existing generated code. 

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

  * [Hello world!](#hello-world)
  * [Presets in depth](#presets-in-depth)
    + [Overwriting existing rendered content](#overwriting-existing-rendered-content)
    + [Ap/pre-pending to existng rendered content](#appre-pending-to-existng-rendered-content)
    + [Reusing presets (options)](#reusing-presets-options)
    + [Adding new dependencies](#adding-new-dependencies)
    + [Overriding the default preset](#overriding-the-default-preset)
  * [Preset's shape](#presets-shape)
    + [Java](#java)
      - [**Class**](#class)
      - [**Enum**](#enum)
    + [JavaScript](#javascript)
      - [**Class**](#class-1)
    + [TypeScript](#typescript)
      - [**Class**](#class-2)
      - [**Interface**](#interface)
      - [**Enum**](#enum-1)
      - [**Type**](#type)
    + [Go](#go)
      - [**Struct**](#struct)
      - [**Enum**](#enum-2)
    + [C#](#c%23)
      - [**Class**](#class-3)
      - [**Enum**](#enum-3)
    + [Rust](#rust)
      - [**Struct**](#struct-1)
      - [**Enum**](#enum-4)
      - [**Package**](#package)
      - [**Union**](#union)
      - [**Tuple**](#tuple)
    + [Dart](#dart)
      - [**Class**](#class-4)
      - [**Enum**](#enum-5)
    + [Python](#python)
      - [**Class**](#class-5)
      - [**Enum**](#enum-6)
    + [C++ (csplusplus)](#c-csplusplus)
      - [**Class**](#class-6)
      - [**Enum**](#enum-7)
    + [Kotlin](#kotlin)
      - [**Class**](#class-7)
      - [**Enum**](#enum-8)
    + [PHP](#php)
      - [**Class**](#class-8)
      - [**Enum**](#enum-9)
- [Limitations](#limitations)
  * [Hard for two presets to write to the exact same location within a class](#hard-for-two-presets-to-write-to-the-exact-same-location-within-a-class)

<!-- tocstop -->

## Hello world!
Lets try to look at an example, every generator start with a bare minimal model called the **default preset** and for the TypeScript that preset would render a class to look something like this: 
```ts
class Root {
  private _email?: string;

  constructor(input: {
    email?: string,
  }) {
    this._email = input.email;
  }

  get email(): string | undefined { return this._email; }
  set email(email: string | undefined) { this._email = email; }
}
```

The generator renderes the TypeScript class by calling **preset hooks**, which is callbacks that is called for rendering parts of the class. 
```html
<self>
  <properties />

  <ctor />

  <getter />
  <setter />

  <additionalContent />
</self>
```

This is what Modelina leverage to customize what is being rendered, because these preset hooks can be **extended or overwritten** by one or more presets.

Lets take a look at an example, say we wanted to a description for each property of the class, maybe just to say hallo to the world. To do this we pass a custom preset to our generator:

```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ 
  presets: [
    {
      class: {
        property({ content }) {
          const description = '// Hello world!'
          return `${description}\n${content}`;
        }
      }
    }
  ]
});
```

This adds a new preset for classes where for each property it runs our callback. The callback then prepends, to the existing `content` that have been rendered by other presets, our comment `// Hello world!`. This now renders all class properties with a comment from us!

```ts
class Root {
  // Hello world!
  private _email?: string;

  constructor(input: {
    email?: string,
  }) {
    this._email = input.email;
  }

  get email(): string | undefined { return this._email; }
  set email(email: string | undefined) { this._email = email; }
}
```

## Presets in depth
A **preset** is a pure JavaScript object with format `key: value`, where `key` is the name of a **model type** and `value` is an object containing callbacks that extend a given rendered part for a given model type, like below example:

```js
{
  // `class` model type 
  class: {
    self(...arguments) { /* logic */ },
    // `setter` customization method 
    setter(...arguments) { /* logic */ },
  },
  interface: {
    // `property` customization method 
    property(...arguments) { /* logic */ },
    additionalContent(...arguments) { /* logic */ },
  },
}
```

Each output has different model types, which results in different implementable methods in a single preset. The different model types can be found in the [preset's shape](#presets-shape) section.

For each custom preset, the implementation of methods for a given model type is optional. It means that you can implement one or all, depending on your use-case.

The order of extending a given part of the model is consistent with the order of presets in the array passed as a `presets` option parameter in the generator's constructor.

As shown in the [Hello world!](#hello-world) example, there are many ways to customize the model generation, this section covers the the different parts.

### Overwriting existing rendered content
Since the preset renders in a form of layers, one of the usecases is to overwrite an already existing rendering of some part of the generated model. Lets try an adapt out hello world example, and instead of prepending comments, we can overwrite the already rendered content, for example lets use public property initializer.

```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ 
  presets: [
    {
      class: {
        property({ property }) {
          return `public ${property.propertyName}${!property.required ? '?' : ''}: ${property.type};`;
        }
      }
    }
  ]
});
```
It would render the following class:
```ts
class Root {
  public _email?: string;

  constructor(input: {
    email?: string,
  }) {
    this._email = input.email;
  }

  get email(): string | undefined { return this._email; }
  set email(email: string | undefined) { this._email = email; }
}
```

### Ap/pre-pending to existng rendered content
As the hello world example appended content, this time lets prepend some content to the properties.
```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ 
  presets: [
    {
      class: {
        property({ content }) {
          const description = '// Hello world!'
          return `${description}\n${content}`;
        }
      }
    }
  ]
});
```

It would render the following class:
```ts
class Root {
  private _email?: string;
  // Hello world!

  constructor(input: {
    email?: string,
  }) {
    this._email = input.email;
  }

  get email(): string | undefined { return this._email; }
  set email(email: string | undefined) { this._email = email; }
}
```

### Reusing presets (options)
Sometimes you might want to create different behavior based on user input, this can be done through options that can be provided with the preset.

Say we want to create a preset with a customizable description that is provided by the use of the preset. To do this we can adapt the [hello world!](#hello-world) example to this:

```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ 
  presets: [
    {
      preset: {
        class: {
          property({ content, options }) {
            const description = options.description !== undefined ? options.description : '// Hello world!'
            return `${description}\n${content}`;
          }
        }
      },
      options: {
        description: "Hello dear customizer!"
      }
    }
  ]
});
```

This enables you to reuse presets (even expose them) to multiple generators
```ts
import { TypeScriptGenerator } from '@asyncapi/modelina';
interface DescriptionOption = {
  description: string
}
const descriptionPreset: TypeScriptPreset<DescriptionOption> = {
  class: {
    property({ content, options }) {
      const description = options.description !== undefined ? options.description : '// Hello world!'
      return `${description}\n${content}`;
    }
  }
}

// One generator prepends `Hello dear customizer!`
const generator = new TypeScriptGenerator({ 
  presets: [
    {
      preset: descriptionPreset,
      options: {
        description: "Hello dear customizer!"
      }
    }
  ]
});

// Second generator prepends `Hello from beyond!`
const generator2 = new TypeScriptGenerator({ 
  presets: [
    {
      preset: descriptionPreset,
      options: {
        description: "Hello from beyond!"
      }
    }
  ]
});
```

### Adding new dependencies
Sometimes the preset might need to use some kind of foreign dependency. To achieve this each preset hook has the possibility of adding its own dependencies through a dependency manager, which can be accessed in `dependencyManager`.

```ts
...
self({ dependencyManager, content }) {
  dependencyManager.addDependency('import java.util.*;');
  return content;
}
...
```

Some languages has specific helper functions, and some very basic interfaces, such as for Java.

In TypeScript because you can have different import syntaxes based on the module system such as [CJS](../examples/typescript-use-cjs/) or [ESM](../examples/typescript-use-esm/), therefore it provies a specific function `addTypeScriptDependency` that takes care of that logic, and you just have to remember `addTypeScriptDependency('ImportanWhat', 'FromWhere')`.

### Overriding the default preset

Each implemented generator must have defined a default preset which forms is minimal generated model, that the rest of the presets add to or removes from. This can be overwritten by passing the `defaultPreset` parameter in the generator options. Check the example for TypeScript generator:

```js
const DEFAULT_PRESET = {
  // implementation
}

const generator = new TypeScriptGenerator({ defaultPreset: DEFAULT_PRESET });
```

> **NOTE**: Default presets MUST implement all preset hooks for a given model type!

## Preset's shape

For each model type, you can implement two basic preset hooks:

- `self` - the method for extending the model shape, this is what calls all additional preset hooks.
- `additionalContent` - the method which adds additional content to the model.

Each preset hook method receives the following arguments:

- `model` - a [`ConstrainedMetaModel`](../src/models/CommonModel.ts) variation which depends on the preset type.
- `inputModel` - an instance of the [`InputMetaModel`](../src/models/InputMetaModel.ts) class.
- `renderer` - an instance of the class with common helper functions to render appropriate model type.
- `content` - rendered content from previous preset.
- `options` - options passed to preset defined in the `presets` array, it's type depends on the specific preset.

Below is a list of supported languages with their model types and corresponding additional preset's methods with extra arguments based on the character of the customization method.

### Java

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### JavaScript

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

### TypeScript

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Interface**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

#### **Type**

This preset is a generator for all meta models `ConstrainedMetaModel` and [can be accessed through the `model` argument](#presets-shape).

There are no additional methods.

### Go

#### **Struct**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `field` | A method to extend rendered given field. | `field` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend rendering the enum items. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance. `index` as `number`, the current enum item being rendered. |

### C#

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `accessor` | A method to extend rendered given property accessor. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### Rust
#### **Struct**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `field` | A method to extend rendered given field. | `field` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `fieldMacro` |  | `field` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `structMacro` |  | `field` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item, `itemIndex`. |
| `itemMacro` |  | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item, `itemIndex`. |
| `structMacro` |  | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item, `itemIndex`. |

#### **Package**

This preset is a generator for the crate package file.

| Method | Description | Additional arguments |
|---|---|---|
| `manifest` |  | `packageOptions`, `InputMetaModel` |
| `lib` |  | `packageOptions`, `inputModel` |

#### **Union**

This preset is a generator for the meta model `ConstrainedUnionModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` |  | `ConstrainedMetaModel` |
| `itemMacro` |  | `ConstrainedMetaModel` |
| `structMacro` |  | `ConstrainedMetaModel` |

#### **Tuple**

This preset is a generator for the meta model `ConstrainedTupleModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `field` |  | `field` object as a [`ConstrainedTupleValueModel`](./internal-model.md#the-constrained-meta-model) instance, `fieldIndex`. |
| `structMacro` |  | `field` object as a [`ConstrainedTupleValueModel`](./internal-model.md#the-constrained-meta-model) instance, `fieldIndex`. |

### Dart
#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `accessor` | A method to extend rendered given property accessor. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### Python

#### **Class**
This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### C++ (csplusplus)

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### Kotlin

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

### PHP

#### **Class**

This preset is a generator for the meta model `ConstrainedObjectModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `ctor` | A method to extend rendered constructor for a given class. | - |
| `property` | A method to extend rendered given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `setter` | A method to extend setter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |
| `getter` | A method to extend getter for a given property. | `property` object as a [`ConstrainedObjectPropertyModel`](./internal-model.md#the-constrained-meta-model) instance. |

#### **Enum**

This preset is a generator for the meta model `ConstrainedEnumModel` and [can be accessed through the `model` argument](#presets-shape).

| Method | Description | Additional arguments |
|---|---|---|
| `item` | A method to extend enum's item. | `item` object as a [`ConstrainedEnumValueModel`](./internal-model.md#the-constrained-meta-model) instance, which contains the value and key of enum's item. |

# Limitations

With features natually comes limitations, and same applies for presets, so here are the known limitations the architecture of presets for Modelina.

## Hard for two presets to write to the exact same location within a class

Say you developed two presets, and you wanted to use both at the same time, but they both to add something right before a property. Example could be one wanted to add `@something` and the other `@something_else`. With the way presets work, one will always be rendered before the other.

```ts
class Root {
  @something
  @something_else
  private _email?: string;
}
```

There are no easy way for those two presets to properly together, and there is no easy way to solve this. You can read more about the issue here: https://github.com/asyncapi/modelina/issues/628