# Dart Constraints

These are the Dart specific constraints applied to the MetaModel before reaching the presets. [Read here to get a more general idea on the overall process](../input-processing.md) of converting a MetaModel to a ConstrainedMetaModel.

## Model Naming
These are the constraints that is applied to model naming. The `Rule key` is what you can use in the options to overwrite the default behavior. See [constraint customization](../constraints.md#Customization).

|Rule key|Rule|Resolution|
|---|---|---|
|NO_SPECIAL_CHAR|No special characters| Special characters are replaced by their name, for example `!` is replaced with `exclamation`. For dart `_` and `$` are an exception to this rule. |
|NO_NUMBER_START_CHAR|No numbers as starting characters|Default behavior is pre pending `number_` in front of the first character|
|NO_EMPTY_VALUE|No empty values|Default behavior is to use `empty` as name. |
|NO_RESERVED_KEYWORDS|No reserved keywords|Dart has a list of reserved keywords ([see the full list here](../../src/generators/dart/Constants.ts))|
|NAMING_FORMATTER|Must be formatted equally|Model name is formatted using pascal case|

## Property naming
These are the constraints that is applied to object properties and the naming of them. The `Rule key` is what you can use in the options to overwrite the default behavior. See [constraint customization](../constraints.md#Customization).
|Rule key|Rule|Resolution|
|---|---|---|
|NO_SPECIAL_CHAR|No special characters| Special characters are replaced by their name, for example `!` is replaced with `exclamation`. For dart `_` and `$` are an exception to this rule. |
|NO_NUMBER_START_CHAR|No numbers as starting characters|Default behavior is pre pending `number_` in front of the first character|
|NO_EMPTY_VALUE|No empty values|Default behavior is to use `empty` as name. |
|NO_RESERVED_KEYWORDS|No reserved keywords|Dart has a list of reserved keywords ([see the full list here](../../src/generators/dart/Constants.ts))|
|NAMING_FORMATTER|Must be formatted equally|Model name is formatted using pascal case|
|NO_DUPLICATE_PROPERTIES|No duplicate properties|If any of the above constraints changes the property name, we must make sure that no duplicates exist within the same object. If any is encountered `reserved_` is pre-pended. This is done recursively until no duplicates are found.| 


## Enum key constraints
These are the constraints that is applied to enum keys. The `Rule key` is what you can use in the options to overwrite the default behavior. See [constraint customization](../constraints.md#Customization).

|Rule key|Rule|Resolution|
|---|---|---|
|NO_SPECIAL_CHAR|No special characters| Special characters are replaced by their name, for example `!` is replaced with `exclamation`. For dart `_` and `$` are an exception to this rule. |
|NO_NUMBER_START_CHAR|No numbers as starting characters|Default behavior is pre pending `number_` in front of the first character|
|NO_EMPTY_VALUE|No empty values|Default behavior is to use `empty` as name. |
|NO_RESERVED_KEYWORDS|No reserved keywords|Dart has a list of reserved keywords ([see the full list here](../../src/generators/dart/Constants.ts))|
|NAMING_FORMATTER|Must be formatted equally|Model name is formatted using pascal case|
|NO_DUPLICATE_KEYS|No duplicate enum keys|If any of the above constraints changes the enum key, we must make sure that no duplicates exist within the same enum. If any is encountered `reserved_` is pre-pended. This is done recursively until no duplicates are found.| 

## Constant
Constant constraints are currently not supported for Dart.
