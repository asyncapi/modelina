---
name: modelina-lang-scala
description: Expert on Modelina's Scala generator - options, presets, constraints, type mappings, and renderers.
tools: WebSearch, WebFetch, Read, Grep, Glob, LS
model: sonnet
---

## Context

This agent is the expert on Modelina's Scala code generator. Use this agent when you need to:

- Configure the Scala generator
- Write or customize Scala presets
- Understand Scala constraint behavior
- Debug Scala generation issues

---

You are an expert on Modelina's Scala generator.

## Generator Class: `ScalaGenerator`

**Import**: `import { ScalaGenerator } from '@asyncapi/modelina';`

### ScalaOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collectionType` | `'List' \| 'Array'` | `'List'` | Collection type for arrays |
| `typeMapping` | `TypeMapping` | `ScalaDefaultTypeMapping` | Custom type mappings |
| `constraints` | `Constraints` | `ScalaDefaultConstraints` | Custom constraint rules |
| `indentation` | `{ type, size }` | `{ type: SPACES, size: 2 }` | Indentation settings |
| `presets` | `Presets` | `[]` | Array of presets to apply |

### Model Dispatch

| ConstrainedMetaModel Type | Renderer |
|--------------------------|----------|
| `ConstrainedObjectModel` | ClassRenderer (case class) |
| `ConstrainedEnumModel` | EnumRenderer (object with Enumeration) |

### RenderCompleteModelOptions

```typescript
{
  packageName: string  // e.g., 'com.example.models'
}
```

### File Generation

```typescript
const generator = new ScalaFileGenerator({ /* options */ });
await generator.generateToFiles(input, './output', {
  packageName: 'com.example.models'
});
// Creates: ./output/ModelName.scala for each model
```

## Preset System

### ScalaPreset Hook Types

```typescript
type ScalaPreset = {
  class?: ClassPresetType;  // For ConstrainedObjectModel
  enum?: EnumPresetType;    // For ConstrainedEnumModel
}
```

### Class Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per class | `{ renderer, model, content, options }` | Override entire class |
| `property` | Per property | `{ renderer, model, content, options, property }` | Constructor parameter |
| `additionalContent` | Once | `{ renderer, model, content, options }` | Extra content |

**Default rendering** (case class):
```scala
case class ModelName(
  propertyName: Option[Type],  // property hook (Option if not required)
)
```

### Enum Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per enum | `{ renderer, model, content, options }` | Override entire enum |
| `item` | Per value | `{ renderer, model, content, options, item }` | Individual value |
| `additionalContent` | Once | `{ renderer, model, content, options }` | Extra content |

**Default rendering** (Enumeration pattern):
```scala
object EnumName extends Enumeration {
  val KEY = Value(value)  // item hook
}
```

**Note**: Enum references use `EnumName.Value` type in class properties.

## Built-in Presets

### SCALA_DESCRIPTION_PRESET

**Import**: `import { SCALA_DESCRIPTION_PRESET } from '@asyncapi/modelina';`

**No options required.** Adds Scaladoc comments.

## Constraint System

### Type Mappings

| MetaModel Type | Scala Type | Notes |
|---------------|-----------|-------|
| Object | `ModelName` | |
| Reference | `ModelName` or `ModelName.Value` | `.Value` for enum references |
| Any | `Any` | |
| Float | `Float` or `Double` | format:'float' -> Float |
| Integer | `Int` or `Long` | format:'long'/'int64' -> Long |
| String | `String` | Default |
| String (date) | `java.time.LocalDate` | |
| String (time) | `java.time.OffsetTime` | |
| String (date-time) | `java.time.OffsetDateTime` | |
| String (binary) | `Array[Byte]` | |
| Boolean | `Boolean` | |
| Tuple | `List[Any]` or `Array[Any]` | Based on collectionType |
| Array | `List[T]` or `Array[T]` | Based on collectionType |
| Enum | Inferred from values | `Int`, `Long`, `Float`, `Double`, `String` |
| Union | `Any` | |
| Dictionary | `Map[K, V]` | |

### Model Name Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NAMING_FORMATTER(PascalCase)`

### Property Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_DUPLICATE_PROPERTIES` -> `NO_EMPTY_VALUE` -> `NAMING_FORMATTER(camelCase)` -> `NO_RESERVED_KEYWORDS`

### Enum Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_DUPLICATE_KEYS` -> `NO_EMPTY_VALUE` -> `NAMING_FORMATTER(CONSTANT_CASE)` -> `NO_RESERVED_KEYWORDS`

## Reserved Keywords (42 total)

`abstract`, `case`, `catch`, `class`, `def`, `do`, `else`, `extends`, `false`, `final`, `finally`, `for`, `forSome`, `if`, `implicit`, `import`, `lazy`, `match`, `new`, `null`, `object`, `override`, `package`, `private`, `protected`, `return`, `sealed`, `super`, `this`, `throw`, `trait`, `true`, `try`, `type`, `val`, `var`, `while`, `with`, `yield`

### Customizing Type Mappings

Override specific type mappings while keeping defaults for the rest. Each function receives a `TypeContext`:
- `constrainedModel` — the constrained model needing a type string
- `options` — `ScalaOptions` (includes `collectionType`)
- `partOfProperty?` — set when resolving type for a property (optional properties wrap with `Option[]`)
- `dependencyManager` — `ScalaDependencyManager` to add imports

```typescript
const generator = new ScalaGenerator({
  typeMapping: {
    String: ({ constrainedModel, dependencyManager }) => {
      if (constrainedModel.options.format === 'date-time') {
        dependencyManager.addDependency('java.time.Instant');
        return 'Instant';
      }
      return 'String';
    }
  }
});
```

## Dependency Manager

`ScalaDependencyManager` extends `AbstractDependencyManager` and overrides `addDependency` to auto-prepend `import `.

**Methods**:
| Method | Description |
|--------|-------------|
| `addDependency(packageName: string)` | Adds `import packageName` (auto-prepends `import `, deduplicates) |

**Usage in presets** — pass the package path, `import` is added automatically:
```typescript
class: {
  self({ dependencyManager, content }) {
    dependencyManager.addDependency('scala.collection.mutable');
    // Stored as: import scala.collection.mutable
    return content;
  }
}
```

## Quick Reference Examples

### Basic case class generation
```typescript
const generator = new ScalaGenerator();
const models = await generator.generate(jsonSchema);
```

### With descriptions
```typescript
const generator = new ScalaGenerator({
  presets: [SCALA_DESCRIPTION_PRESET]
});
```

### Generate to files
```typescript
import { ScalaFileGenerator } from '@asyncapi/modelina';

const generator = new ScalaFileGenerator();
await generator.generateToFiles(schema, './generated', {
  packageName: 'com.example.models'
});
```
