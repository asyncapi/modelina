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
- [Include Jackson annotations for the class](#include-jackson-annotations-for-the-class)

<!-- tocstop -->

## Include equals function for the class
To overwrite the `equal` method, use the preset `JAVA_COMMON_PRESET` and provide the option `equal: true`.

Check out this [example for a live demonstration](../../examples/java-generate-equals).


## Include hashCode function for the class
To overwrite the `hashCode` method, use the preset `JAVA_COMMON_PRESET` and provide the option `hashCode: true`.

Check out this [example for a live demonstration](../../examples/java-generate-hashcode).

## Change the collection type for arrays
TODO

## Include toString function for the class
To overwrite the `toString` method, use the preset `JAVA_COMMON_PRESET` and provide the option `classToString: true`.

Check out this [example for a live demonstration](../../examples/java-generate-tostring).

## Include JavaDoc for properties
To generate models containing `JavaDocs` from description and examples, use the `JAVA_DESCRIPTION_PRESET` option.

Check out this [example for a live demonstration](../../examples/java-generate-javadoc).

## Include Javax validation constraint annotations for properties
In some cases, when you generate the models from JSON Schema, you may want to include `javax.validation.constraint` annotations.

Check out this [example for a live demonstration](../../examples/java-generate-javax-constraint-annotation).

## Include Jackson annotations for the class
TODO
