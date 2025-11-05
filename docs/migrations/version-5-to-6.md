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

## AsyncAPI

### Multiple messages in operations now generate individual models

When processing AsyncAPI v3 documents with multiple messages in a single operation, Modelina now correctly generates individual models for each message payload in addition to the `oneOf` wrapper model.

**Example AsyncAPI Document:**
```yaml
asyncapi: 3.0.0
info:
  title: User Service
  version: 1.0.0
channels:
  userEvents:
    address: user/events
    messages:
      UserCreated:
        $ref: '#/components/messages/UserCreated'
      UserUpdated:
        $ref: '#/components/messages/UserUpdated'
operations:
  onUserEvents:
    action: receive
    channel:
      $ref: '#/channels/userEvents'
    messages:
      - $ref: '#/channels/userEvents/messages/UserCreated'
      - $ref: '#/channels/userEvents/messages/UserUpdated'
components:
  messages:
    UserCreated:
      payload:
        type: object
        properties:
          id:
            type: string
          name:
            type: string
    UserUpdated:
      payload:
        type: object
        properties:
          id:
            type: string
          name:
            type: string
          updatedAt:
            type: string
```

**Before (v5):**
```typescript
const generator = new JavaGenerator();
const models = await generator.generate(inputModel);
// Problem: No UserCreated or UserUpdated classes were generated
```

**After (v6):**
```typescript
const generator = new JavaGenerator();
const models = await generator.generate(inputModel);
// ✓ Now generates:
//   - UserCreatedPayload.java
//   - UserUpdatedPayload.java
//   - userEvents interface (discriminated union)
```

No code changes are required. This is an enhancement that fixes incomplete model generation. If you have custom post-processing logic that filters generated models, you may need to adjust it to handle the additional models.
