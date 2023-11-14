# Migration from v2 to v3

This document contains all the breaking changes and migrations guidelines for adapting your code to the new version.

### TypeScript

Is not affected by this change.

### JavaScript

Is not affected by this change.

### C#

Is not affected by this change.

### Java

#### java.time.Duration is used when format is duration

This example used to generate a `String`, but is now instead using `java.time.Duration`.

```yaml
type: object
properties:
  duration:
    type: string
    format: duration
```

will generate

```java
public class TestClass {
  private java.time.Duration duration;
  ...
}
```

### Kotlin

Is not affected by this change.

### Rust

Is not affected by this change.

### Python

Is not affected by this change.

### Go

Is not affected by this change.

### Dart

Is not affected by this change.

### C++

Is not affected by this change.
