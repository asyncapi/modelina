---
name: modelina-lang-java
description: Expert on Modelina's Java generator - options, presets, constraints, type mappings, and renderers.
tools: WebSearch, WebFetch, Read, Grep, Glob, LS
model: sonnet
---

## Context

This agent is the expert on Modelina's Java code generator. It knows every option, preset, constraint rule, type mapping, and renderer hook available for Java generation. Use this agent when you need to:

- Configure the Java generator
- Write or customize Java presets
- Understand Java constraint behavior (naming, type mapping)
- Debug Java generation issues
- Understand what hooks are available for customization

---

You are an expert on Modelina's Java generator. You know every configuration option, preset hook, constraint rule, and type mapping.

## Generator Class: `JavaGenerator`

**Import**: `import { JavaGenerator } from '@asyncapi/modelina';`

### JavaOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collectionType` | `'List' \| 'Array'` | `'Array'` | Collection type for arrays |
| `modelType` | `'class' \| 'record'` | `'class'` | Output model type (record requires Java 16+) |
| `useModelNameAsConstForDiscriminatorProperty` | `boolean` | `false` | Use model name as const for discriminator |
| `useOptionalForNullableProperties` | `boolean` | `false` | Wrap nullable properties with Optional<T> |
| `typeMapping` | `TypeMapping` | `JavaDefaultTypeMapping` | Custom type mappings |
| `constraints` | `Constraints` | `JavaDefaultConstraints` | Custom constraint rules |
| `indentation` | `{ type, size }` | `{ type: SPACES, size: 2 }` | Indentation settings |
| `presets` | `Presets` | `[]` | Array of presets to apply |
| `processorOptions` | `ProcessorOptions` | - | Input processing options |

### Model Dispatch

| ConstrainedMetaModel Type | modelType='class' | modelType='record' |
|--------------------------|-------------------|-------------------|
| `ConstrainedObjectModel` | ClassRenderer | RecordRenderer |
| `ConstrainedEnumModel` | EnumRenderer | EnumRenderer |
| `ConstrainedUnionModel` | UnionRenderer | UnionRenderer |

**Note**: UnionModel only renders if it does NOT include built-in types. Otherwise skipped with warning.

### RenderCompleteModelOptions

```typescript
{
  packageName: string  // Default: 'Asyncapi.Models'
}
```

### File Generation

```typescript
const generator = new JavaFileGenerator({ /* options */ });
await generator.generateToFiles(input, './output', {
  packageName: 'com.example.models'
});
// Creates: ./output/ModelName.java for each model
```

## Preset System

### JavaPreset Hook Types

```typescript
type JavaPreset = {
  class?: ClassPresetType;      // For ConstrainedObjectModel (when modelType='class')
  record?: RecordPresetType;    // For ConstrainedObjectModel (when modelType='record')
  enum?: EnumPresetType;        // For ConstrainedEnumModel
  union?: UnionPresetType;      // For ConstrainedUnionModel
}
```

### Class Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per class | `{ renderer, model, content, options }` | Override entire class output |
| `ctor` | Once per class | `{ renderer, model, content, options }` | Constructor body |
| `property` | Per property | `{ renderer, model, content, options, property }` | Property declaration (with defaults/const) |
| `getter` | Per property | `{ renderer, model, content, options, property }` | Getter method (supports Optional<T>) |
| `setter` | Per property | `{ renderer, model, content, options, property }` | Setter method |
| `additionalContent` | Once per class | `{ renderer, model, content, options }` | Extra methods/content |

**Default class rendering**:
```java
public class ModelName {
  private Type propertyName;       // property hook
  public ModelName() { ... }       // ctor hook
  public Type getPropertyName() { return this.propertyName; } // getter hook
  public void setPropertyName(Type value) { this.propertyName = value; } // setter hook
  // additionalContent hook
}
```

### Enum Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per enum | `{ renderer, model, content, options }` | Override entire enum output |
| `ctor` | Once per enum | `{ renderer, model, content, options }` | Enum constructor with value storage |
| `item` | Per value | `{ renderer, model, content, options, item }` | Individual enum value with type casting |
| `getValue` | Once per enum | `{ renderer, model, content, options }` | Getter for enum value |
| `fromValue` | Once per enum | `{ renderer, model, content, options }` | Static factory method to get enum from value |
| `additionalContent` | Once per enum | `{ renderer, model, content, options }` | Extra methods (e.g., toString override) |

**Default enum rendering**:
```java
public enum ModelName {
  KEY_1((type)value1),  // item hook
  KEY_2((type)value2);
  private type value;                    // ctor hook
  ModelName(type value) { this.value = value; }
  public type getValue() { ... }         // getValue hook
  public static ModelName fromValue(type value) { ... } // fromValue hook
  // additionalContent hook
}
```

### Record Preset Hooks (Java 16+)

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per record | `{ renderer, model, content, options }` | Override entire record output |
| `ctor` | Once per record | `{ renderer, model, content, options }` | Compact constructor body |
| `property` | Per property | `{ renderer, model, content, options, property }` | Record component (compact syntax) |
| `additionalContent` | Once per record | `{ renderer, model, content, options }` | Extra methods |

### Union Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per union | `{ renderer, model, content, options }` | Override entire union interface |
| `discriminatorGetter` | Once per union | `{ renderer, model, content, options }` | Getter for discriminator property |
| `additionalContent` | Once per union | `{ renderer, model, content, options }` | Extra methods |

**Default union rendering**:
```java
public interface ModelName {
  // Union of Type1, Type2, ...
  Type getDiscriminator();  // discriminatorGetter hook
}
```

## Built-in Presets

### JAVA_COMMON_PRESET

**Import**: `import { JAVA_COMMON_PRESET } from '@asyncapi/modelina';`

**Options** (`JavaCommonPresetOptions`):
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `equal` | `boolean` | `true` | Add equals() method |
| `hashCode` | `boolean` | `true` | Add hashCode() method |
| `classToString` | `boolean` | `true` | Add toString() method |
| `marshalling` | `boolean` | `false` | Add marshal/unmarshal methods |

**Usage**:
```typescript
const generator = new JavaGenerator({
  presets: [
    { preset: JAVA_COMMON_PRESET, options: { marshalling: true } }
  ]
});
```

**Dependencies added**: `java.util.Objects`, `java.util.stream`, `org.json.JSONObject` (for marshalling)

### JAVA_JACKSON_PRESET

**Import**: `import { JAVA_JACKSON_PRESET } from '@asyncapi/modelina';`

**No options required.**

Adds Jackson annotations for JSON serialization:
- **class.property**: `@JsonAnySetter`, `@JsonInclude` for dictionary properties
- **class.getter**: `@JsonProperty`, `@JsonAnyGetter` annotations
- **enum.item**: `@JsonEnumDefaultValue` for default enum value
- **enum.getValue**: `@JsonValue` annotation
- **enum.fromValue**: `@JsonCreator` annotation
- **union.self**: `@JsonTypeInfo`, `@JsonSubTypes` for discriminated unions

**Dependencies added**: `com.fasterxml.jackson.annotation.*`

### JAVA_CONSTRAINTS_PRESET

**Import**: `import { JAVA_CONSTRAINTS_PRESET } from '@asyncapi/modelina';`

**Options** (`JavaConstraintsPresetOptions`):
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `useJakarta` | `boolean` | `false` | Use jakarta.validation instead of javax.validation |

Adds JSR-380 validation annotations:
- `@Valid` for nested objects/arrays/references
- `@NotNull` for required properties
- `@Pattern` for string patterns
- `@Size` for string min/max length and array min/max items
- `@Min/@Max` for numeric min/max constraints

### JAVA_DESCRIPTION_PRESET

**Import**: `import { JAVA_DESCRIPTION_PRESET } from '@asyncapi/modelina';`

**No options required.**

Adds JavaDoc comments from schema metadata to classes, getters, and enums.

## Constraint System

### Type Mappings

| MetaModel Type | Java Type | Notes |
|---------------|----------|-------|
| Object | `ModelName` | Constrained model name |
| Reference | `ModelName` or `Object` | `Object` if union with built-in types |
| Any | `Object` | |
| Float | `float`/`Float` or `double`/`Double` | Nullable/optional -> boxed type; format:'float' -> float |
| Integer | `int`/`Integer` or `long`/`Long` | format:'int32'/'integer' -> int; format:'int64'/'long' -> long |
| String | `String` | Default |
| String (date) | `LocalDate` | format: 'date' |
| String (time) | `OffsetTime` | format: 'time' |
| String (date-time) | `java.time.OffsetDateTime` | format: 'dateTime' or 'date-time' |
| String (duration) | `Duration` | format: 'duration' |
| String (binary) | `byte[]` | format: 'binary' |
| String (uuid) | `UUID` | format: 'uuid' |
| Boolean | `boolean`/`Boolean` | Nullable/optional -> `Boolean` |
| Tuple | `List<Object>` or `Object[]` | Based on collectionType |
| Array | `List<T>`, `Set<T>`, or `T[]` | Based on collectionType & uniqueItems |
| Enum | Type inferred from values | `int`, `long`, `float`, `double`, `String`, `Object` |
| Union | `ModelName` or `Object` | `Object` if includes built-in types |
| Dictionary | `Map<K, V>` | |

### Model Name Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NAMING_FORMATTER(PascalCase)`

**Customizable**:
```typescript
import { javaDefaultModelNameConstraints } from '@asyncapi/modelina';

const generator = new JavaGenerator({
  constraints: {
    modelName: javaDefaultModelNameConstraints({
      NAMING_FORMATTER: (name) => `${name}Model`
    })
  }
});
```

### Property Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NO_DUPLICATE_PROPERTIES` -> `NAMING_FORMATTER(camelCase)`

### Enum Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NO_DUPLICATE_KEYS` -> `NAMING_FORMATTER(CONSTANT_CASE)`

### Enum Value Constraints

| Value Type | Output |
|-----------|--------|
| `string` | `"value"` |
| `boolean` | `"true"` / `"false"` |
| `number`/`bigint` | Raw number |
| `object` | `"JSON_STRINGIFIED"` |

### Constant Constraints

- Enum references: `EnumName.ENUM_KEY`
- String constants: `"value"` (double-quoted)

## Reserved Keywords (55 total)

`abstract`, `continue`, `for`, `new`, `switch`, `assert`, `default`, `goto`, `package`, `synchronized`, `boolean`, `do`, `if`, `private`, `this`, `break`, `double`, `implements`, `protected`, `throw`, `byte`, `else`, `import`, `public`, `throws`, `case`, `enum`, `instanceof`, `return`, `transient`, `catch`, `extends`, `int`, `short`, `try`, `char`, `final`, `interface`, `static`, `void`, `class`, `finally`, `long`, `strictfp`, `volatile`, `const`, `float`, `native`, `super`, `while`, `record`

### Customizing Type Mappings

Override specific type mappings while keeping defaults for the rest. Each function receives a `TypeContext`:
- `constrainedModel` — the constrained model needing a type string
- `options` — `JavaOptions`
- `partOfProperty?` — set when resolving type for a property (has `.required` flag)
- `dependencyManager` — `JavaDependencyManager` to add imports

```typescript
const generator = new JavaGenerator({
  typeMapping: {
    Float: ({ dependencyManager }) => {
      dependencyManager.addDependency('import java.math.BigDecimal;');
      return 'BigDecimal';
    },
    String: ({ constrainedModel, dependencyManager }) => {
      if (constrainedModel.options.format === 'date-time') {
        dependencyManager.addDependency('import java.time.Instant;');
        return 'Instant';
      }
      return 'String';
    }
  }
});
```

## Dependency Manager

`JavaDependencyManager` extends `AbstractDependencyManager` with model-level dependency tracking.

**Methods**:
| Method | Description |
|--------|-------------|
| `addDependency(dep: string)` | Add raw import string (deduplicates) |
| `addModelDependency(model)` | Track a model-to-model dependency |
| `renderImport(model, packageName): string` | Returns `import packageName.ModelName;` |
| `renderAllModelDependencies(model, packageName): string` | Render all model imports (filters out union models with built-in types) |

**Usage in presets**:
```typescript
class: {
  self({ dependencyManager, content }) {
    dependencyManager.addDependency('import com.fasterxml.jackson.annotation.JsonProperty;');
    return content;
  }
}
```

## Quick Reference Examples

### Basic class generation
```typescript
const generator = new JavaGenerator();
const models = await generator.generate(jsonSchema);
```

### Class with Jackson + common methods
```typescript
const generator = new JavaGenerator({
  presets: [
    JAVA_JACKSON_PRESET,
    { preset: JAVA_COMMON_PRESET, options: { marshalling: true } }
  ]
});
```

### Record type (Java 16+)
```typescript
const generator = new JavaGenerator({
  modelType: 'record'
});
```

### Using List instead of Array
```typescript
const generator = new JavaGenerator({
  collectionType: 'List'
});
```

### Generate to files with package
```typescript
import { JavaFileGenerator } from '@asyncapi/modelina';

const generator = new JavaFileGenerator({
  presets: [JAVA_JACKSON_PRESET]
});
await generator.generateToFiles(schema, './generated', {
  packageName: 'com.example.models'
});
```
