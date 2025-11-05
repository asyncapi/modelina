# Migration from v5 to v6

This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Removed deprecated `interpreter` option from `ProcessorOptions`

The deprecated `interpreter` option has been removed from `ProcessorOptions`. You should now use the `jsonSchema` option instead.

**Before (v5):**
```typescript
const result = await generator.generate({
  processorOptions: {
    interpreter: {
      // interpreter options
    }
  }
});
```

**After (v6):**
```typescript
const result = await generator.generate({
  processorOptions: {
    jsonSchema: {
      // JSON Schema processor options
    }
  }
});
```
## Python

### Removal of deprecated `importsStyle` option

The `importsStyle` option was deprecated in v4 and has now been completely removed in v6. This option is no longer needed as all Python models now use explicit import style (`from . import ${model.name}`) to support circular model dependencies.

If you were still using this option in your code, simply remove it from your generator options:

```ts
// Before (v5 and earlier)
const generator = new PythonGenerator();
const models = await generator.generateCompleteModels(schema, {
  importsStyle: 'explicit', // This option is no longer available
  packageName: 'modelina'
});

// After (v6)
const generator = new PythonGenerator();
const models = await generator.generateCompleteModels(schema, {
  packageName: 'modelina'
});
```

The generated Python code behavior remains unchanged - all imports will continue to use the explicit style.

# Miscellaneous

## Upgrading dependencies

The following dependencies have been upgraded in v6:

Production Dependencies:
- `@apidevtools/json-schema-ref-parser`: `^11.1.0` → `^14.2.0`
- `@apidevtools/swagger-parser`: `^10.1.0` → `^12.1.0`
- `alterschema`: `^1.1.2` → `^1.1.3`
- `fast-xml-parser`: `^5.3.0` → `^5.3.1`
- `typescript-json-schema`: `^0.58.1` → `^0.65.1`

Development Dependencies:

- `@swc/core`: `^1.10.9` → `^1.15.0`

These dependency upgrades may include breaking changes from the respective packages. Please refer to their individual changelogs if you're using any of these packages directly in your code.
