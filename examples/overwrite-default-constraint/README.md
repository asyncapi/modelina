# Overwrite default constraint

This example shows how to overwrite the whole constraint logic instead of a small part of it. In this case we create a very simple model name constraint that return the name as pascal case.

Note the difference here to [overwriting naming formatting](../overwrite-naming-formatting/) is that this removes all of the default constraints such as `no special chars`, etc. 

If you do not handle these special cases you will encounter Modelina generate syntactically incorrect models when given certain inputs.

## How to run this example

Run this example using:

```sh
npm i && npm run start
```

If you are on Windows, use the `start:windows` script instead:

```sh
npm i && npm run start:windows
```
