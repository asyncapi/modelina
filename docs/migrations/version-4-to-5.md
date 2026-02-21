# Migration from v4 to v5

This document contains all the breaking changes and migration guidelines for adapting your code to the new version.

## AsyncAPI message name used for anonymous payload schemas

Previously, when processing AsyncAPI documents, if a message payload schema did not have an explicit `title` or `$id`, Modelina would generate a model name like `AnonymousSchema_1`. This made it difficult to identify which message the model corresponded to.

Starting from v5, Modelina now uses the **message name** (from `message.id()` for `$ref` messages or `message.name()` for inline messages) as the model name when the payload schema is anonymous.

### Example

Given this AsyncAPI document:

```yaml
asyncapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
channels:
  userSignup:
    address: user/signedup
    messages:
      UserSignedUp:
        $ref: '#/components/messages/UserSignedUp'
operations:
  onUserSignup:
    action: receive
    channel:
      $ref: '#/channels/userSignup'
    messages:
      - $ref: '#/channels/userSignup/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
          email:
            type: string
```

**Before (v4):**

The generated model would be named `AnonymousSchema_1`:

```typescript
class AnonymousSchema_1 {
  private _displayName?: string;
  private _email?: string;
  // ...
}
```

**After (v5):**

The generated model is now named after the message (`UserSignedUp`):

```typescript
class UserSignedUp {
  private _displayName?: string;
  private _email?: string;
  // ...
}
```

### Migration

If your code depends on the old `AnonymousSchema_X` naming convention, you will need to update your imports and references to use the new message-based names.

For example:

```typescript
// Before
import { AnonymousSchema_1 } from './models/AnonymousSchema_1';

// After
import { UserSignedUp } from './models/UserSignedUp';
```

### Workaround

If you prefer the old behavior, you can explicitly set a `title` on your payload schemas to control the generated model name:

```yaml
components:
  messages:
    UserSignedUp:
      payload:
        title: MyCustomModelName  # This will be used as the model name
        type: object
        properties:
          displayName:
            type: string
```
