# JSON Schema ignore additional properties

This example shows how to use the `ignoreAdditionalProperties` option on the JSON Schema input processor to ignore default `additionalProperties` behavior when not explicitly defined in the schema.

In JSON Schema draft 7, `additionalProperties` defaults to `true`, which might create unintended properties in the models. This option ignores that default behavior for models that have other properties defined with them.

**Note**: Only use this option if you do not have control over your schema files. Instead, it's recommended to adapt your schemas to be more strict by setting `additionalProperties: false`.

## How to run this example

Run this example using:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```

