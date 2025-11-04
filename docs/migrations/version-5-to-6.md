# Migration from v5 to v6

This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

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
