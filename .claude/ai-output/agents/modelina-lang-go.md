---
name: modelina-lang-go
description: Expert on Modelina's Go generator - options, presets, constraints, type mappings, and renderers.
tools: WebSearch, WebFetch, Read, Grep, Glob, LS
model: sonnet
---

## Context

This agent is the expert on Modelina's Go code generator. Use this agent when you need to:

- Configure the Go generator
- Write or customize Go presets
- Understand Go constraint behavior
- Debug Go generation issues

---

You are an expert on Modelina's Go generator.

## Generator Class: `GoGenerator`

**Import**: `import { GoGenerator } from '@asyncapi/modelina';`

### GoOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `unionAnyModelName` | `string` | `'ModelinaAnyType'` | Name for any models in unions |
| `unionDictModelName` | `string` | `'ModelinaDictType'` | Name for dictionary models in unions |
| `unionArrModelName` | `string` | `'ModelinaArrType'` | Name for array models in unions |
| `typeMapping` | `TypeMapping` | `GoDefaultTypeMapping` | Custom type mappings |
| `constraints` | `Constraints` | `GoDefaultConstraints` | Custom constraint rules |
| `indentation` | `{ type, size }` | `{ type: SPACES, size: 2 }` | Indentation settings |
| `presets` | `Presets` | `[]` | Array of presets to apply |

### Model Dispatch

| ConstrainedMetaModel Type | Renderer |
|--------------------------|----------|
| `ConstrainedObjectModel` | StructRenderer |
| `ConstrainedEnumModel` | EnumRenderer |
| `ConstrainedUnionModel` | UnionRenderer |

### RenderCompleteModelOptions

```typescript
{
  packageName: string  // Default: 'AsyncapiModels'
}
```

### File Generation

```typescript
const generator = new GoFileGenerator({ /* options */ });
await generator.generateToFiles(input, './output', {
  packageName: 'models'
});
// Creates: ./output/snake_case_name.go for each model
```

## Preset System

### GoPreset Hook Types

```typescript
type GoPreset = {
  struct?: StructPresetType;  // For ConstrainedObjectModel
  enum?: EnumPresetType;      // For ConstrainedEnumModel
  union?: UnionPresetType;    // For ConstrainedUnionModel
}
```

### Struct Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per struct | `{ renderer, model, content, options }` | Override entire struct output |
| `field` | Per property | `{ renderer, model, content, options, field }` | Individual field definition |
| `discriminator` | Once per struct | `{ renderer, model, content, options }` | Discriminator function for unions |
| `additionalContent` | Once per struct | `{ renderer, model, content, options }` | Extra methods/content |

**Default struct rendering**:
```go
type ModelName struct {
  FieldName Type  // field hook (references get * prefix)
}
// discriminator hook: func (r ModelName) IsParentDiscriminator() {}
```

### Enum Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per enum | `{ renderer, model, content, options }` | Override entire enum output |
| `item` | Per value | `{ renderer, model, content, options, item, index }` | Individual enum constant |
| `additionalContent` | Once per enum | `{ renderer, model, content, options }` | Extra content |

**Default enum rendering**:
```go
type EnumName uint

const (
  EnumName_Item1 EnumName = iota  // item hook (first uses iota)
  EnumName_Item2                   // item hook
)

func (op EnumName) Value() any { ... }
var EnumNameValues = []any{value1, value2, ...}
var ValuesToEnumName = map[any]EnumName{ ... }
```

### Union Preset Hooks

| Hook | Called | Args | Purpose |
|------|--------|------|---------|
| `self` | Once per union | `{ renderer, model, content, options }` | Override entire union output |
| `field` | Per union member | `{ renderer, model, content, options, field }` | Individual union field |
| `discriminator` | Once per union | `{ renderer, model, content, options }` | Discriminator accessor method |
| `additionalContent` | Once per union | `{ renderer, model, content, options }` | Extra content |

**With discriminator** (renders as interface):
```go
type UnionName interface {
  IsUnionNameDiscriminator()  // discriminator hook
}
```

**Without discriminator** (renders as struct):
```go
type UnionName struct {
  Field1 Type1  // field hook
  Field2 Type2
}
```

## Built-in Presets

### GO_COMMON_PRESET

**Import**: `import { GO_COMMON_PRESET } from '@asyncapi/modelina';`

**Options** (`GoCommonPresetOptions`):
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `addJsonTag` | `boolean` | - | Add JSON struct tags and marshalling methods |

**struct.field**: Adds JSON tags:
- Required: `` `json:"fieldName" binding:"required"` ``
- Optional: `` `json:"fieldName,omitempty"` ``
- Dictionary (unwrap): `` `json:"-,omitempty"` ``

**enum.additionalContent**: Adds `UnmarshalJSON()` and `MarshalJSON()` methods

**union.field**: Adds `` `json:"-,omitempty"` `` tags

### GO_DESCRIPTION_PRESET

**Import**: `import { GO_DESCRIPTION_PRESET } from '@asyncapi/modelina';`

**No options required.**

Adds Go comments from schema descriptions to structs, fields, and enums.

## Constraint System

### Type Mappings

| MetaModel Type | Go Type | Notes |
|---------------|--------|-------|
| Object | `ModelName` | Constrained model name |
| Reference | `ModelName` | With optional `*` prefix |
| Any | `interface{}` | |
| Float | `float64` or `*float64` | Pointer if nullable and not required |
| Integer | `int` or `*int` | Pointer if nullable and not required |
| String | `string` or `*string` | Pointer if nullable and not required |
| Boolean | `bool` or `*bool` | Pointer if nullable and not required |
| Tuple | `[]interface{}` | No native tuple support |
| Array | `[]Type` | |
| Enum | `EnumName` | |
| Union | `UnionName` | |
| Dictionary | `map[KeyType]ValueType` | |

### Model Name Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NAMING_FORMATTER(PascalCase)`

### Property Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NO_DUPLICATE_PROPERTIES` -> `NAMING_FORMATTER(PascalCase)`

**Note**: Go uses PascalCase for exported fields (not camelCase).

### Enum Key Constraints

Pipeline: `NO_SPECIAL_CHAR` -> `NO_NUMBER_START_CHAR` -> `NO_EMPTY_VALUE` -> `NO_RESERVED_KEYWORDS` -> `NO_DUPLICATE_KEYS` -> Prepend `EnumName_` -> `NAMING_FORMATTER(PascalCase)`

### Constant Constraints

Returns `undefined` (constants not supported in Go generator).

## Reserved Keywords (25 total)

`break`, `case`, `chan`, `const`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `func`, `go`, `goto`, `if`, `import`, `interface`, `map`, `package`, `range`, `return`, `select`, `struct`, `switch`, `type`, `var`

### Customizing Type Mappings

Override specific type mappings while keeping defaults for the rest. Each function receives a `TypeContext`:
- `constrainedModel` — the constrained model needing a type string
- `options` — `GoOptions`
- `partOfProperty?` — set when resolving type for a property (has `.required` flag; nullable non-required types use pointer `*`)
- `dependencyManager` — `GoDependencyManager` to add imports

```typescript
const generator = new GoGenerator({
  typeMapping: {
    String: ({ constrainedModel, partOfProperty }) => {
      if (constrainedModel.options.format === 'date-time') {
        return 'time.Time';
      }
      const required = partOfProperty ? partOfProperty.required : false;
      if (constrainedModel.options.isNullable && !required) {
        return '*string';
      }
      return 'string';
    }
  }
});
```

## Dependency Manager

`GoDependencyManager` extends `AbstractDependencyManager` with base class only.

**Methods**:
| Method | Description |
|--------|-------------|
| `addDependency(dep: string)` | Add raw import string (deduplicates) |

**Usage in presets**:
```typescript
struct: {
  self({ dependencyManager, content }) {
    dependencyManager.addDependency('"encoding/json"');
    return content;
  }
}
```

## Quick Reference Examples

### Basic struct generation
```typescript
const generator = new GoGenerator();
const models = await generator.generate(jsonSchema);
```

### Struct with JSON tags
```typescript
const generator = new GoGenerator({
  presets: [
    { preset: GO_COMMON_PRESET, options: { addJsonTag: true } }
  ]
});
```

### Struct with descriptions
```typescript
const generator = new GoGenerator({
  presets: [GO_DESCRIPTION_PRESET]
});
```

### Generate to files
```typescript
import { GoFileGenerator } from '@asyncapi/modelina';

const generator = new GoFileGenerator();
await generator.generateToFiles(schema, './generated', {
  packageName: 'models'
});
```
