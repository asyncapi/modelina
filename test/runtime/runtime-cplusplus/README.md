# Modelina C++ Runtime project

This is the Modelina C++ runtime project that is used to test the Java-generated code from Modelina at runtime to ensure that everything works as expected.

Here is how it works:

- The models are first generated during the build phase of the project, by running the root npm script `npm run generate:runtime:cplusplus`. These models are pre-defined with the [generic input](../generic-input.json).
- The tests are manually added and changed.
- When the project is tested, it tests the generated models at runtime for semantic errors.
