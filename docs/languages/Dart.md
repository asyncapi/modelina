# Dart
There are special use-cases that each language supports; this document pertains to **Dart models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Dart](#dart)
  - [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  - [Include Json annotation for the class and enums](#include-json-annotation-for-the-class-and-enums)

<!-- tocstop -->

## Generate serializer and deserializer functionality

Sometimes you want to serialize the data models, this can either be into JSON, XML, etc. And it can even be from multiple libraries, all dependant on what your use-case is.
This is what is currently supported:

- [JSON through json_annotation package](#include-json-annotation-for-the-class-and-enums) 

## Include Json annotation for the class and enums

When you generate the models with json annotation, generated files include json_annotation package (https://pub.dev/packages/json_annotation/) and their syntax 

Check out this [example for a live demonstration](../../examples/dart-generate-json-annotation).
