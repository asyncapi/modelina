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
