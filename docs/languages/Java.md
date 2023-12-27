# Java

There are special use-cases that each language supports; this document pertains to **Java models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Include equals function for the class](#include-equals-function-for-the-class)
- [Include hashCode function for the class](#include-hashcode-function-for-the-class)
- [Change the collection type for arrays](#change-the-collection-type-for-arrays)
- [Include toString function for the class](#include-tostring-function-for-the-class)
- [Include JavaDoc for properties](#include-javadoc-for-properties)
- [Include Javax validation constraint annotations for properties](#include-javax-validation-constraint-annotations-for-properties)
- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
    + [Jackson annotation](#jackson-annotation)
    + [JSON marshaling and unmarshaling methods](#json-marshaling-and-unmarshaling-methods)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)
- [Integrate Modelina into Maven](#integrate-modelina-into-maven)

<!-- tocstop -->

## Include equals function for the class

To overwrite the `equal` method, use the preset `JAVA_COMMON_PRESET` and provide the option `equal: true`.

Check out this [example for a live demonstration](../../examples/java-generate-equals).

## Include hashCode function for the class

To overwrite the `hashCode` method, use the preset `JAVA_COMMON_PRESET` and provide the option `hashCode: true`.

Check out this [example for a live demonstration](../../examples/java-generate-hashcode).

## Change the collection type for arrays

Sometimes, we might want to render a different collection type, and instead of the default `Array` use as `List` type. To do so, provide the option `collectionType: 'List'`.

Check out this [example for a live demonstration](../../examples/java-change-collection-type).

## Include toString function for the class

To overwrite the `toString` method, use the preset `JAVA_COMMON_PRESET` and provide the option `classToString: true`.

Check out this [example for a live demonstration](../../examples/java-generate-tostring).

## Include JavaDoc for properties

To generate models containing `JavaDocs` from description and examples, use the `JAVA_DESCRIPTION_PRESET` option.

Check out this [example for a live demonstration](../../examples/java-generate-javadoc).

## Include Javax validation constraint annotations for properties

In some cases, when you generate the models from JSON Schema, you may want to include `javax.validation.constraint` annotations.

Check out this [example for a live demonstration](../../examples/java-generate-javax-constraint-annotation).

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use: 

- [Jackson annotation](#jackson-annotation) 
- [JSON marshaling and unmarshaling methods](#json-marshaling-and-unmarshaling-methods) 

#### Jackson annotation

To generate Java data models with Jackson annotation using `JAVA_JACKSON_PRESET` option.

Check out this [example for a live demonstration](../../examples/java-generate-jackson-annotation).

**External dependencies**
Requires [com.fasterxml.jackson.annotation](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations) to work.

#### JSON marshaling and unmarshaling methods

Sometimes you just want to convert your class to JSON without the use of annotations such as Jackson.

Check out this [example for a live demonstration](../../examples/java-generate-marshalling).

**External dependencies**
Requires [org.json package](https://search.maven.org/artifact/org.json/json/20211205/bundle) to work.

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

## Integrate Modelina into Maven
We have created an example Maven project to show you how to generate AsyncAPI payload models from your AsyncAPI file and integrate it into the build process. [You can find the integration example here](../integration.md#integrate-with-maven).