# Determining the additionalProperties for the model

Additional properties are determined by the following form:
1. Incase it is `undefined` or `false` the `additionalProperties` is sat to `undefined`. This is because undefined are easier to handle in the rendering phase then if `additionalProperties` could be `undefined` or `false`. 
2. Otherwise recursively simplify the `additionalProperties` schema/boolean.