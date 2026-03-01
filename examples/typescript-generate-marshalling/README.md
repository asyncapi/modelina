# TypeScript Data Models with un/marshalling functionality

A basic example of how to use the un/marshalling functionality of the TypeScript class.

## Generated Methods

When `marshalling: true` is enabled, the following methods are generated:

### `toJson(): Record<string, unknown>`
Converts the instance to a plain JSON-serializable object. Useful when you need to work with the data as an object before serialization.

### `marshal(): string`
Converts the instance to a JSON string. Internally calls `JSON.stringify(this.toJson())`.

### `static fromJson(obj: Record<string, unknown>): ClassName`
Creates an instance from a plain JSON object. Useful when you receive data as an object (e.g., from an API response already parsed).

### `static unmarshal(json: string | object): ClassName`
Creates an instance from either a JSON string or object. For strings, it parses first then calls `fromJson()`. For objects, it directly calls `fromJson()`.

## Example Usage

```typescript
// Create an instance
const meeting = new Meeting({
  email: 'test@example.com',
  createdAt: new Date()
});

// Convert to plain object (for manipulation or custom serialization)
const jsonObject = meeting.toJson();
console.log(jsonObject); // { email: 'test@example.com', createdAt: '2023-01-01T00:00:00.000Z' }

// Convert to JSON string
const jsonString = meeting.marshal();

// Create from plain object
const fromObj = Meeting.fromJson(jsonObject);

// Create from JSON string
const fromString = Meeting.unmarshal(jsonString);
```

## How to run this example

Run this example using:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```
