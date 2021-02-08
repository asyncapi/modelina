# Determining the extend for the model

The `extend` keyword is one of the few not originally from the JSON Schema. This keyword is used for when an object needs to extend another, where the name of the other CommonModel is used. Because of the nature of JSON Schema (`allOf` being an array) this extend keyword is an array of strings.

The simplification process determines the `extend` keyword based on the `allOf` keyword, where it iterates over all schemas and recursively simplifies each. If iterated simplified schema is of type object we add it to the `extend` list.