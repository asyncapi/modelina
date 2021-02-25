## Classes

<dl>
<dt><a href="#AbstractGenerator">AbstractGenerator</a></dt>
<dd><p>Abstract generator which must be implemented by each language</p>
</dd>
<dt><a href="#AbstractRenderer">AbstractRenderer</a></dt>
<dd><p>Abstract renderer with common helper methods</p>
</dd>
<dt><a href="#CommonInputModel">CommonInputModel</a></dt>
<dd><p>This class is the wrapper for simplified models and the rest of the context needed for further generate typed models.</p>
</dd>
<dt><a href="#CommonModel">CommonModel</a> ⇐ <code><a href="#CommonModel">CommonSchema&lt;CommonModel&gt;</a></code></dt>
<dd><p>Common internal representation for a model.</p>
</dd>
<dt><a href="#CommonSchema">CommonSchema</a></dt>
<dd><p>CommonSchema which contains the common properties between Schema and CommonModel</p>
</dd>
<dt><a href="#OutputModel">OutputModel</a></dt>
<dd><p>Common representation for the output model.</p>
</dd>
<dt><a href="#Schema">Schema</a> ⇐ <code><a href="#Schema">CommonSchema&lt;Schema&gt;</a></code></dt>
<dd><p>JSON Schema Draft 7 model</p>
</dd>
<dt><a href="#AsyncAPIInputProcessor">AsyncAPIInputProcessor</a></dt>
<dd><p>Class for processing AsyncAPI inputs</p>
</dd>
<dt><a href="#InputProcessor">InputProcessor</a></dt>
<dd><p>Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.</p>
</dd>
<dt><a href="#JsonSchemaInputProcessor">JsonSchemaInputProcessor</a></dt>
<dd><p>Class for processing JSON Schema</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#simplify">simplify(schema)</a></dt>
<dd><p>This is the default wrapper for the simplifier class which always create a new instance of the simplifier.</p>
</dd>
<dt><a href="#simplifyAdditionalProperties">simplifyAdditionalProperties(schema)</a></dt>
<dd><p>Find out which common models we should extend</p>
</dd>
<dt><a href="#simplifyEnums">simplifyEnums(schema, seenSchemas)</a></dt>
<dd><p>Find the enums for a simplified version of a schema</p>
</dd>
<dt><a href="#ensureNotEnumsAreRemoved">ensureNotEnumsAreRemoved(schema, existingEnums, seenSchemas)</a></dt>
<dd><p>Ensure enums in not are never included.</p>
</dd>
<dt><a href="#handleCombinationSchemas">handleCombinationSchemas(schemas, existingEnums, seenSchemas)</a></dt>
<dd><p>Ensuring all enums inside combination schemas are added</p>
</dd>
<dt><a href="#addToEnums">addToEnums(enumsToCheck, existingEnums)</a></dt>
<dd><p>Tries to add enums if they don&#39;t already exist</p>
</dd>
<dt><a href="#simplifyExtend">simplifyExtend(schema)</a></dt>
<dd><p>Find out which CommonModels we should extend</p>
</dd>
<dt><a href="#tryAddExtends">tryAddExtends(simplifiedModels, extendingSchemas)</a></dt>
<dd><p>Figure out if the simplified models should be extended</p>
</dd>
<dt><a href="#simplifyItems">simplifyItems(schema, simplifier, seenSchemas)</a></dt>
<dd><p>Find the items for a simplified version of a schema</p>
</dd>
<dt><a href="#combineSchemas">combineSchemas(schema, currentOutput, simplifier, seenSchemas)</a></dt>
<dd><p>Go through schema(s) and combine the simplified items together.</p>
</dd>
<dt><a href="#mergeWithCurrentModel">mergeWithCurrentModel(model, schema, currentOutput)</a></dt>
<dd><p>Merge common models together</p>
</dd>
<dt><a href="#simplifyName">simplifyName(schema)</a></dt>
<dd><p>Find the name for simplified version of schema</p>
</dd>
<dt><a href="#simplifyProperties">simplifyProperties(schema, simplifier, seenSchemas)</a></dt>
<dd><p>Simplifier function for finding the simplified version of properties.</p>
</dd>
<dt><a href="#addToProperty">addToProperty(propName, propModel, schema, currentModel)</a></dt>
<dd><p>Adds a property to the model</p>
</dd>
<dt><a href="#combineSchemas">combineSchemas(schema, currentModel, simplifier, seenSchemas, rootSchema)</a></dt>
<dd><p>Go through schema(s) and combine the simplified properties together.</p>
</dd>
<dt><a href="#simplifyRequired">simplifyRequired(schema, seenSchemas)</a></dt>
<dd><p>Find the required array for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyTypes">simplifyTypes(schema, seenSchemas)</a></dt>
<dd><p>Find the types for a simplified version of a schema</p>
</dd>
<dt><a href="#inferTypeFromValue">inferTypeFromValue(value)</a></dt>
<dd><p>Infers the JSON Schema type from value</p>
</dd>
<dt><a href="#inferTypes">inferTypes(schema, currentOutput)</a></dt>
<dd><p>Infer types from enum and const values.</p>
</dd>
<dt><a href="#inferNotTypes">inferNotTypes(schema, currentOutput, seenSchemas)</a></dt>
<dd><p>Infer which types the model should NOT be.</p>
</dd>
<dt><a href="#addToTypes">addToTypes(typesToAdd, currentOutput)</a></dt>
<dd><p>Adds missing types to the array.</p>
</dd>
<dt><a href="#combineSchemas">combineSchemas(schema, currentOutput, seenSchemas)</a></dt>
<dd><p>Go through schema(s) and combine the simplified types together.</p>
</dd>
<dt><a href="#isModelObject">isModelObject()</a></dt>
<dd><p>check if CommonModel is a separate model or a simple model.</p>
</dd>
</dl>

<a name="AbstractGenerator"></a>

## AbstractGenerator
Abstract generator which must be implemented by each language

**Kind**: global class  
<a name="AbstractRenderer"></a>

## AbstractRenderer
Abstract renderer with common helper methods

**Kind**: global class  
<a name="CommonInputModel"></a>

## CommonInputModel
This class is the wrapper for simplified models and the rest of the context needed for further generate typed models.

**Kind**: global class  
<a name="CommonModel"></a>

## CommonModel ⇐ [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)
Common internal representation for a model.

**Kind**: global class  
**Extends**: [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $id | <code>string</code> | define the id/name of the model. |
| type | <code>string</code> \| <code>Array.&lt;string&gt;</code> | this is the different types for the model. All types from JSON Schema are used with no custom ones added. |
| enum | <code>Array.&lt;any&gt;</code> | defines the different enums for the model, constant values are included here |
| items | [<code>CommonModel</code>](#CommonModel) \| [<code>Array.&lt;CommonModel&gt;</code>](#CommonModel) | defines the type for `array` models as `CommonModel`. |
| properties | <code>Record.&lt;string, CommonModel&gt;</code> | defines the properties and its expected types as `CommonModel`. |
| additionalProperties | [<code>CommonModel</code>](#CommonModel) | are used to define if any extra properties are allowed, also defined as a  `CommonModel`. |
| $ref | <code>string</code> | is a reference to another `CommonModel` by using`$id` as a simple string. |
| required | <code>Array.&lt;string&gt;</code> | list of required properties. |
| extend | <code>Array.&lt;string&gt;</code> | list of other `CommonModel`s this model extends, is an array of `$id` strings. |
| originalSchema | [<code>Schema</code>](#Schema) \| <code>boolean</code> | the actual input for which this model represent. |


* [CommonModel](#CommonModel) ⇐ [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)
    * _instance_
        * [.getFromSchema(key)](#CommonModel+getFromSchema) ⇒ <code>any</code>
        * [.isRequired(propertyName)](#CommonModel+isRequired) ⇒ <code>boolean</code>
        * [.getImmediateDependencies()](#CommonModel+getImmediateDependencies)
    * _static_
        * [.toCommonModel(object)](#CommonModel.toCommonModel) ⇒
        * [.mergeItems(mergeTo, mergeFrom, originalSchema)](#CommonModel.mergeItems)
        * [.mergeTypes(mergeTo, mergeFrom)](#CommonModel.mergeTypes)
        * [.mergeCommonModels(mergeTo, mergeFrom, originalSchema)](#CommonModel.mergeCommonModels)

<a name="CommonModel+getFromSchema"></a>

### commonModel.getFromSchema(key) ⇒ <code>any</code>
Retrieves data from originalSchema by given key

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| key | given key |

<a name="CommonModel+isRequired"></a>

### commonModel.isRequired(propertyName) ⇒ <code>boolean</code>
Checks if given property name is required in object

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| propertyName | given property name |

<a name="CommonModel+getImmediateDependencies"></a>

### commonModel.getImmediateDependencies()
This function returns an array of `$id`s from all the CommonModel's it immediate depends on.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  
<a name="CommonModel.toCommonModel"></a>

### CommonModel.toCommonModel(object) ⇒
Transform object into a type of CommonModel.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  
**Returns**: CommonModel instance of the object  

| Param | Description |
| --- | --- |
| object | to transform |

<a name="CommonModel.mergeItems"></a>

### CommonModel.mergeItems(mergeTo, mergeFrom, originalSchema)
Merge items together so only one CommonModel remains.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo | CommonModel to merge types into |
| mergeFrom | CommonModel to merge from |
| originalSchema |  |

<a name="CommonModel.mergeTypes"></a>

### CommonModel.mergeTypes(mergeTo, mergeFrom)
Merge types together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo | CommonModel to merge types into |
| mergeFrom | CommonModel to merge from |

<a name="CommonModel.mergeCommonModels"></a>

### CommonModel.mergeCommonModels(mergeTo, mergeFrom, originalSchema)
Only merge if left side is undefined and right side is sat OR both sides are defined

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo | CommonModel to merge into |
| mergeFrom | CommonModel to merge values from |
| originalSchema | schema to use as original schema |

<a name="CommonSchema"></a>

## CommonSchema
CommonSchema which contains the common properties between Schema and CommonModel

**Kind**: global class  
<a name="CommonSchema.transformSchema"></a>

### CommonSchema.transformSchema(schema, transformationSchemaCallback)
Function to transform nested schemas into type of generic extended class

Since both CommonModel and Schema uses these properties we need a common function to
convert nested schemas into their corresponding class.

**Kind**: static method of [<code>CommonSchema</code>](#CommonSchema)  

| Param | Description |
| --- | --- |
| schema | to be transformed |
| transformationSchemaCallback | callback to transform nested schemas |

<a name="OutputModel"></a>

## OutputModel
Common representation for the output model.

**Kind**: global class  
<a name="Schema"></a>

## Schema ⇐ [<code>CommonSchema&lt;Schema&gt;</code>](#Schema)
JSON Schema Draft 7 model

**Kind**: global class  
**Extends**: [<code>CommonSchema&lt;Schema&gt;</code>](#Schema)  
<a name="Schema.toSchema"></a>

### Schema.toSchema(object) ⇒
Transform object into a type of Schema.

**Kind**: static method of [<code>Schema</code>](#Schema)  
**Returns**: CommonModel instance of the object  

| Param | Description |
| --- | --- |
| object | to transform |

<a name="AsyncAPIInputProcessor"></a>

## AsyncAPIInputProcessor
Class for processing AsyncAPI inputs

**Kind**: global class  

* [AsyncAPIInputProcessor](#AsyncAPIInputProcessor)
    * _instance_
        * [.process(input)](#AsyncAPIInputProcessor+process)
        * [.shouldProcess(input)](#AsyncAPIInputProcessor+shouldProcess)
    * _static_
        * [.reflectSchemaNames(schema)](#AsyncAPIInputProcessor.reflectSchemaNames)
        * [.isFromParser(input)](#AsyncAPIInputProcessor.isFromParser)

<a name="AsyncAPIInputProcessor+process"></a>

### asyncAPIInputProcessor.process(input)
Process the input as an AsyncAPI document

**Kind**: instance method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="AsyncAPIInputProcessor+shouldProcess"></a>

### asyncAPIInputProcessor.shouldProcess(input)
Figures out if an object is of type AsyncAPI document

**Kind**: instance method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="AsyncAPIInputProcessor.reflectSchemaNames"></a>

### AsyncAPIInputProcessor.reflectSchemaNames(schema)
Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension.
This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.

**Kind**: static method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param | Description |
| --- | --- |
| schema | to reflect name for |

<a name="AsyncAPIInputProcessor.isFromParser"></a>

### AsyncAPIInputProcessor.isFromParser(input)
Figure out if input is from our parser.

**Kind**: static method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="InputProcessor"></a>

## InputProcessor
Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.

**Kind**: global class  

* [InputProcessor](#InputProcessor)
    * [.addProcessor(type, processor)](#InputProcessor+addProcessor)
    * [.process(input, type)](#InputProcessor+process)

<a name="InputProcessor+addProcessor"></a>

### inputProcessor.addProcessor(type, processor)
Add a processor.

**Kind**: instance method of [<code>InputProcessor</code>](#InputProcessor)  

| Param | Description |
| --- | --- |
| type | of processor |
| processor |  |

<a name="InputProcessor+process"></a>

### inputProcessor.process(input, type)
The processor code which delegates the processing to the correct implementation.

**Kind**: instance method of [<code>InputProcessor</code>](#InputProcessor)  

| Param | Description |
| --- | --- |
| input | to process |
| type | of processor to use |

<a name="JsonSchemaInputProcessor"></a>

## JsonSchemaInputProcessor
Class for processing JSON Schema

**Kind**: global class  

* [JsonSchemaInputProcessor](#JsonSchemaInputProcessor)
    * _instance_
        * [.process(input)](#JsonSchemaInputProcessor+process)
        * [.shouldProcess(input)](#JsonSchemaInputProcessor+shouldProcess)
        * [.processDraft7(input)](#JsonSchemaInputProcessor+processDraft7)
    * _static_
        * [.reflectSchemaNames(schema, namesStack, name, isRoot)](#JsonSchemaInputProcessor.reflectSchemaNames)
        * [.ensureNamePattern(previousName, ...newParts)](#JsonSchemaInputProcessor.ensureNamePattern)
        * [.convertSchemaToCommonModel(schema)](#JsonSchemaInputProcessor.convertSchemaToCommonModel)

<a name="JsonSchemaInputProcessor+process"></a>

### jsonSchemaInputProcessor.process(input)
Function for processing a JSON Schema input.

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param |
| --- |
| input | 

<a name="JsonSchemaInputProcessor+shouldProcess"></a>

### jsonSchemaInputProcessor.shouldProcess(input)
Unless the schema states one that is not supported we assume its of type JSON Schema

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param |
| --- |
| input | 

<a name="JsonSchemaInputProcessor+processDraft7"></a>

### jsonSchemaInputProcessor.processDraft7(input)
Process a draft 7 schema

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| input | to process as draft 7 |

<a name="JsonSchemaInputProcessor.reflectSchemaNames"></a>

### JsonSchemaInputProcessor.reflectSchemaNames(schema, namesStack, name, isRoot)
Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.

**Kind**: static method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| schema | to process |
| namesStack | is a aggegator of previous used names |
| name | to infer |
| isRoot | indicates if performed schema is a root schema |

<a name="JsonSchemaInputProcessor.ensureNamePattern"></a>

### JsonSchemaInputProcessor.ensureNamePattern(previousName, ...newParts)
Ensure schema name using previous name and new part

**Kind**: static method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| previousName | to concatenate with |
| ...newParts |  |

<a name="JsonSchemaInputProcessor.convertSchemaToCommonModel"></a>

### JsonSchemaInputProcessor.convertSchemaToCommonModel(schema)
Simplifies a JSON Schema into a common models

**Kind**: static method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| schema | to simplify to common model |

<a name="simplify"></a>

## simplify(schema)
This is the default wrapper for the simplifier class which always create a new instance of the simplifier.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to simplify |

<a name="simplifyAdditionalProperties"></a>

## simplifyAdditionalProperties(schema)
Find out which common models we should extend

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find extends of |

<a name="simplifyEnums"></a>

## simplifyEnums(schema, seenSchemas)
Find the enums for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified enums for |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

<a name="ensureNotEnumsAreRemoved"></a>

## ensureNotEnumsAreRemoved(schema, existingEnums, seenSchemas)
Ensure enums in not are never included.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | currently searching in |
| existingEnums | which have already been found |
| seenSchemas | already seen schemas and their respectable output |

<a name="handleCombinationSchemas"></a>

## handleCombinationSchemas(schemas, existingEnums, seenSchemas)
Ensuring all enums inside combination schemas are added

**Kind**: global function  

| Param | Description |
| --- | --- |
| schemas | to search in |
| existingEnums | which have already been found |
| seenSchemas | already seen schemas and their respectable output |

<a name="addToEnums"></a>

## addToEnums(enumsToCheck, existingEnums)
Tries to add enums if they don't already exist

**Kind**: global function  

| Param |
| --- |
| enumsToCheck | 
| existingEnums | 

<a name="simplifyExtend"></a>

## simplifyExtend(schema)
Find out which CommonModels we should extend

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find extends of |

<a name="tryAddExtends"></a>

## tryAddExtends(simplifiedModels, extendingSchemas)
Figure out if the simplified models should be extended

**Kind**: global function  

| Param | Description |
| --- | --- |
| simplifiedModels | to check if we need to extend |
| extendingSchemas | already extended CommonModels |

<a name="simplifyItems"></a>

## simplifyItems(schema, simplifier, seenSchemas)
Find the items for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified items for |
| simplifier | the simplifier instance |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

<a name="combineSchemas"></a>

## combineSchemas(schema, currentOutput, simplifier, seenSchemas)
Go through schema(s) and combine the simplified items together.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to go through |
| currentOutput | the current output |
| simplifier | the simplifier to use |
| seenSchemas | schemas which we already have outputs for |

<a name="mergeWithCurrentModel"></a>

## mergeWithCurrentModel(model, schema, currentOutput)
Merge common models together

**Kind**: global function  

| Param | Description |
| --- | --- |
| model | to merge from |
| schema | it is from |
| currentOutput | to merge into |

<a name="simplifyName"></a>

## simplifyName(schema)
Find the name for simplified version of schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the name |

<a name="simplifyProperties"></a>

## simplifyProperties(schema, simplifier, seenSchemas)
Simplifier function for finding the simplified version of properties.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | the schema to simplify properties for |
| simplifier | the simplifier instance |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

<a name="addToProperty"></a>

## addToProperty(propName, propModel, schema, currentModel)
Adds a property to the model

**Kind**: global function  

| Param | Description |
| --- | --- |
| propName | name of the property |
| propModel | the corresponding model |
| schema | the schema for the model |
| currentModel | the current output |

<a name="combineSchemas"></a>

## combineSchemas(schema, currentModel, simplifier, seenSchemas, rootSchema)
Go through schema(s) and combine the simplified properties together.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to go through |
| currentModel | the current output |
| simplifier | the simplifier to use |
| seenSchemas | schemas which we already have outputs for |
| rootSchema | the root schema we are combining schemas for |

<a name="simplifyRequired"></a>

## simplifyRequired(schema, seenSchemas)
Find the required array for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified required array for |
| seenSchemas | already seen schemas, this is to avoid circular schemas |

<a name="simplifyTypes"></a>

## simplifyTypes(schema, seenSchemas)
Find the types for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified types for |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

<a name="inferTypeFromValue"></a>

## inferTypeFromValue(value)
Infers the JSON Schema type from value

**Kind**: global function  

| Param | Description |
| --- | --- |
| value | to infer type of |

<a name="inferTypes"></a>

## inferTypes(schema, currentOutput)
Infer types from enum and const values.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to go through |
| currentOutput | the current output |

<a name="inferNotTypes"></a>

## inferNotTypes(schema, currentOutput, seenSchemas)
Infer which types the model should NOT be.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to go through |
| currentOutput | the current output |
| seenSchemas | schemas which we already have outputs for |

<a name="addToTypes"></a>

## addToTypes(typesToAdd, currentOutput)
Adds missing types to the array.

**Kind**: global function  

| Param | Description |
| --- | --- |
| typesToAdd | which types we should try and add to the existing output |
| currentOutput | the current output |

<a name="combineSchemas"></a>

## combineSchemas(schema, currentOutput, seenSchemas)
Go through schema(s) and combine the simplified types together.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to go through |
| currentOutput | the current output |
| seenSchemas | schemas which we already have outputs for |

<a name="isModelObject"></a>

## isModelObject()
check if CommonModel is a separate model or a simple model.

**Kind**: global function  
