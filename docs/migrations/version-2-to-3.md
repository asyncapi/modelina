# Migration from v2 to v3

This document contains all the breaking changes and migrations guidelines for adapting your code to the new version.

### TypeScript

Is not affected by this change.

### JavaScript

Is not affected by this change.

### C#

#### System.TimeSpan is used when format is time

This example used to generate a `string`, but is now instead using `System.TimeSpan`.

```yaml
type: object
properties:
  duration:
    type: string
    format: time
```

will generate

```csharp
public class TestClass {
  private System.TimeSpan duration;
  ...
}
```

#### System.DateTime is used when format is date-time

This example used to generate a `string`, but is now instead using `System.DateTime`.

```yaml
type: object
properties:
  dob:
    type: string
    format: date-time
```

will generate

```csharp
public class TestClass {
  private System.DateTime dob;
  ...
}
```

#### System.Guid is used when format is uuid

This example used to generate a `string`, but is now instead using `System.Guid`.

```yaml
type: object
properties:
  uniqueId:
    type: string
    format: uuid
```

will generate

```csharp
public class TestClass {
  private System.Guid uniqueId;
  ...
}
```

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
