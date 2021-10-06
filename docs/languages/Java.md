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
TODO

## Include hashCode function for the class
TODO

## Change the collection type for arrays
TODO

## Include toString function for the class
TODO

## Include JavaDoc for properties
To generate models containing `JavaDocs` from description and examples, use the `JAVA_DESCRIPTION_PRESET` option.

Check out this [example for a live demonstration](../../examples/java-generate-javadoc).

## Include Javax validation constraint annotations for properties
In some cases, when you generate the models from JSON Schema, you may want to include `javax.validation.constraint` annotations.

Check out this [example for a live demonstration](../../examples/java-generate-javax-constraint-annotation).

## Include Jackson annotations for the class
TODO
