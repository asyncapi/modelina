# Go Union Types

Modelina now supports union types for `Go`. Since `Go` does not have native union types support modelina uses `struct embeddings` to mock union types. Modelina has custom names for models that are not directly embedded in structs. Users can update the default names by passing custom values. 


```ts
const generator = new GoGenerator({
  unionAnyModelName: 'ModelinaAnyType',
  unionArrModelName: 'ModelinaArrType',
  unionDictModelName: 'ModelinaDictType'
});
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
