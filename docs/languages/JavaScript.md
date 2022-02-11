# JavaScript
There are special use-cases that each language supports; this document pertains to **JavaScript models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Rendering complete models to a specific module system](#rendering-complete-models-to-a-specific-module-system)
- [Generate un/marshal functions for classes](#generate-unmarshal-functions-for-classes)

<!-- tocstop -->

## Rendering complete models to a specific module system
In some cases you might need to render the complete models to a specific module system such as ESM and CJS.

Check out this [example for a live demonstration how to generate the complete JavaScript models to use ESM module system](../../examples/javascript-use-esm).

Check out this [example for a live demonstration how to generate the complete JavaScript models to use CJS module system](../../examples/javascript-use-cjs).


## Generate un/marshal functions for classes

Sometimes you want to use the models for data transfers, and while most cases would work out of the box, custom serializer functionality is needed for the advanced cases. If you generated the data models based on a JSON Schema document and you want the serialized data to validate against the schema, this functionality is REQUIRED.

Here, this can be done by including the preset `JS_COMMON_PRESET` using the option `marshalling`.

Check out this [example out for a live demonstration]().
