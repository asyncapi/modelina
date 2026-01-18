# JSON Schema ignore additional items

This example shows how to use the `ignoreAdditionalItems` option on the JSON Schema input processor to ignore default `additionalItems` behavior when not explicitly defined in the schema.

In JSON Schema draft 7, `additionalItems` defaults to `true`, which might create unintended types for arrays. This option ignores that default behavior for arrays as long as there are other types set for the array.

**Note**: Only use this option if you do not have control over your schema files. Instead, it's recommended to adapt your schemas to be more strict by setting `additionalItems: false`.

## How to run this example

Run this example using:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```

