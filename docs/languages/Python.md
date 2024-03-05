# Python

There are special use-cases that each language supports; this document pertains to **Python models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate Pydantic models](#generate-pydantic-models)
- [Generate models with JSON Serializer and Deserializer methods](#generate-models-with-json-serializer-and-deserializer-methods)
  * [Limitations](#limitations)

<!-- tocstop -->

## Generate Pydantic models

In some cases you might want to use [pydantic](https://pypi.org/project/pydantic/) data validation and settings management using Python type hints for the models.
Modelina follows Pydantic v2.

There are some limitations to the current implementation:
1. The preset doesn't unwrap properties of type `ConstrainedDictionaryModel` with `serialilzationType = unwrap`, they are simply excluded from the serialization

You can find an example of its use [here](../../examples/generate-python-pydantic-models/index.ts)

## Generate models with JSON Serializer and Deserializer methods

Using the preset `PYTON_JSON_SERIALIZER`, you can generate `serializeToJson` method to convert model instance to JSON and `deserializeFromJson` method to convert JSON to model instance.

### Limitations

1. Above preset doesn't unwrap properties of type `ConstrainedDictionaryModel` with `serialilzationType = unwrap`
2. The serialized JSON object will have the same property names as defined in the model object.

Check out [this example for a live demonstration.](../../examples/python-generate-json-serializer-and-deserializer/index.ts)
