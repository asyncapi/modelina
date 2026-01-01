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

## Typescript 
### Date formats now generate `Date` instead of `string`

In Modelina v5, OpenAPI schema fields with type `string` and formats such as
`date-time`, `date`, or `time` were generated as `string` in TypeScript models.

Starting from v6, these formats are now mapped to the native `Date` type.

This is a **breaking change** and may require updates in consumer code.

#### What changed

**Before (v5):**
```ts
sentAt?: string; 
```

**After(v6):**
```ts
sentAt?: Date; 
```
#### Migration notes

- Update TypeScript type annotations that previously expected `string`
- Ensure any custom serialization or parsing logic handles `Date` objects
- Update mocks, tests, and fixtures that rely on string values for date fields

## AsyncAPI

### Improved schema naming strategy

Modelina v6 introduces a significantly improved naming strategy for AsyncAPI schemas, providing more meaningful and context-aware names for generated models to minimize the amount of `Anonymous Schema`. If you have explicitly defined names for all models, this should not affect you.

#### Channel-based naming for inline message payloads

Inline message payloads (without explicit message names) now derive their names from the channel path instead of receiving generic anonymous names.

**Before (v5):**
```yaml
asyncapi: 2.0.0
channels:
  /user/signedup:
    subscribe:
      message:
        payload:
          type: object
          properties:
            email:
              type: string
```
Generated model: `AnonymousSchema_1` or `<anonymous-message-1>Payload`

**After (v6):**
Generated model: `UserSignedupPayload` (derived from channel path `/user/signedup`)

#### Hierarchical naming for nested schemas

Nested schemas in properties, `allOf`, `oneOf`, `anyOf`, `dependencies`, and `definitions` now receive hierarchical names based on their parent schema and property path.

**Before (v5):**
```yaml
components:
  schemas:
    MainSchema:
      type: object
      properties:
        config:
          type: object
          properties:
            setting:
              type: string
```
Generated models: `MainSchema`, `AnonymousSchema_2`, `AnonymousSchema_3`

**After (v6):**
Generated models: `MainSchema`, `MainSchemaConfig`, `MainSchemaConfigSetting`

#### Improved handling of composition keywords

Schemas using `allOf`, `oneOf`, and `anyOf` now generate more descriptive names:

**Before (v5):**
```yaml
components:
  schemas:
    Pet:
      oneOf:
        - type: object
          properties:
            bark: { type: boolean }
        - type: object
          properties:
            meow: { type: boolean }
```
Generated models: `Pet`, `AnonymousSchema_1`, `AnonymousSchema_2`

**After (v6):**
Generated models: `Pet`, `PetOneOfOption0`, `PetOneOfOption1`

#### Enhanced naming for special schema types

- **Array items**: `ParentSchemaItem` instead of `AnonymousSchema_N`
- **Pattern properties**: `ParentSchemaPatternProperty` instead of `AnonymousSchema_N`
- **Additional properties**: `ParentSchemaAdditionalProperty` instead of `AnonymousSchema_N`
- **Dependencies**: `ParentSchemaDependencyName` instead of `AnonymousSchema_N`
- **Definitions**: `ParentSchemaDefinitionName` instead of `AnonymousSchema_N`

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
