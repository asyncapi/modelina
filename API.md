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
<dt><a href="#RenderOutput">RenderOutput</a></dt>
<dd><p>Common representation for the rendered output.</p>
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
<dt><a href="#LoggerClass">LoggerClass</a></dt>
<dd><p>Logger class for the model generation library</p>
<p>This class acts as a forefront for any external loggers which is why it also implements the interface itself.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#DefaultPropertyNames">DefaultPropertyNames</a></dt>
<dd><p>Default property names for different aspects of the common model</p>
</dd>
<dt><a href="#CommonNamingConventionImplementation">CommonNamingConventionImplementation</a></dt>
<dd><p>A CommonNamingConvention implementation shared between generators for different languages.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getUniquePropertyName">getUniquePropertyName(rootModel, propertyName)</a></dt>
<dd><p>Recursively find the proper property name.</p>
<p>This function ensures that the property name is unique for the model</p>
</dd>
<dt><a href="#interpretAdditionalItems">interpretAdditionalItems(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 additionalProperties keyword.</p>
</dd>
<dt><a href="#interpretAdditionalProperties">interpretAdditionalProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 additionalProperties keyword.</p>
</dd>
<dt><a href="#interpretAllOf">interpretAllOf(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 allOf keyword.</p>
<p>It either merges allOf schemas into existing model or if allowed, create inheritance.</p>
</dd>
<dt><a href="#interpretConst">interpretConst(schema, model)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 const keyword.</p>
</dd>
<dt><a href="#interpretDependencies">interpretDependencies(schema, model)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 dependencies keyword.</p>
</dd>
<dt><a href="#interpretEnum">interpretEnum(schema, model)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 enum keyword</p>
</dd>
<dt><a href="#interpretItems">interpretItems(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 items keyword.</p>
</dd>
<dt><a href="#interpretArrayItems">interpretArrayItems(rootSchema, itemSchemas, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Internal function to process all item schemas</p>
</dd>
<dt><a href="#interpretNot">interpretNot(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 not keyword.</p>
</dd>
<dt><a href="#interpretPatternProperties">interpretPatternProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for JSON Schema draft 7 patternProperties keyword.</p>
</dd>
<dt><a href="#interpretProperties">interpretProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for interpreting JSON Schema draft 7 properties keyword.</p>
</dd>
<dt><a href="#postInterpretModel">postInterpretModel(model)</a></dt>
<dd><p>Post process the interpreted model. By applying the following:</p>
<ul>
<li>Ensure models are split as required</li>
</ul>
</dd>
<dt><a href="#trySplitModels">trySplitModels(model, iteratedModels)</a></dt>
<dd><p>This function splits up a model if needed and add the new model to the list of models.</p>
</dd>
<dt><a href="#ensureModelsAreSplit">ensureModelsAreSplit(model, iteratedModels)</a></dt>
<dd><p>Split up all models which should and use ref instead.</p>
</dd>
<dt><a href="#isEnum">isEnum(model)</a></dt>
<dd><p>Check if CommonModel is an enum</p>
</dd>
<dt><a href="#isModelObject">isModelObject(model)</a></dt>
<dd><p>Check if CommonModel is a separate model or a simple model.</p>
</dd>
<dt><a href="#inferTypeFromValue">inferTypeFromValue(value)</a></dt>
<dd><p>Infers the JSON Schema type from value</p>
</dd>
<dt><a href="#interpretName">interpretName(schema)</a></dt>
<dd><p>Find the name for simplified version of schema</p>
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
<a name="AbstractRenderer+addDependency"></a>

### abstractRenderer.addDependency(dependency)
Adds a dependency while ensuring that only one dependency is preset at a time.

**Kind**: instance method of [<code>AbstractRenderer</code>](#AbstractRenderer)  

| Param | Description |
| --- | --- |
| dependency | complete dependency string so it can be rendered as is. |

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
| patternProperties | <code>Record.&lt;string, CommonModel&gt;</code> | are used for any extra properties that matches a specific pattern to be of specific type. |
| $ref | <code>string</code> | is a reference to another `CommonModel` by using`$id` as a simple string. |
| required | <code>Array.&lt;string&gt;</code> | list of required properties. |
| extend | <code>Array.&lt;string&gt;</code> | list of other `CommonModel`s this model extends, is an array of `$id` strings. |
| originalSchema | [<code>Schema</code>](#Schema) \| <code>boolean</code> | the actual input for which this model represent. |


* [CommonModel](#CommonModel) ⇐ [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)
    * _instance_
        * [.getFromSchema(key)](#CommonModel+getFromSchema) ⇒ <code>any</code>
        * [.setType(type)](#CommonModel+setType)
        * [.removeType(types)](#CommonModel+removeType)
        * [.addTypes(types)](#CommonModel+addTypes)
        * [.isRequired(propertyName)](#CommonModel+isRequired) ⇒ <code>boolean</code>
        * [.addItem(itemModel, schema, addAsArray)](#CommonModel+addItem)
        * [.addItemTuple(tupleModel, schema, index)](#CommonModel+addItemTuple)
        * [.addEnum(enumValue)](#CommonModel+addEnum)
        * [.removeEnum(enumValue)](#CommonModel+removeEnum)
        * [.addProperty(propertyName, propertyModel, schema)](#CommonModel+addProperty)
        * [.addAdditionalProperty(additionalPropertiesModel, schema)](#CommonModel+addAdditionalProperty)
        * [.addAdditionalItems(additionalItemsModel, schema)](#CommonModel+addAdditionalItems)
        * [.addPatternProperty(pattern, patternModel, schema)](#CommonModel+addPatternProperty)
        * [.addExtendedModel(extendedModel)](#CommonModel+addExtendedModel)
        * [.getNearestDependencies()](#CommonModel+getNearestDependencies)
    * _static_
        * [.toCommonModel(object)](#CommonModel.toCommonModel) ⇒
        * [.mergeProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergeProperties)
        * [.mergeAdditionalProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergeAdditionalProperties)
        * [.mergeAdditionalItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergeAdditionalItems)
        * [.mergePatternProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergePatternProperties)
        * [.mergeItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergeItems)
        * [.mergeTypes(mergeTo, mergeFrom)](#CommonModel.mergeTypes)
        * [.mergeCommonModels(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)](#CommonModel.mergeCommonModels)

<a name="CommonModel+getFromSchema"></a>

### commonModel.getFromSchema(key) ⇒ <code>any</code>
Retrieves data from originalSchema by given key

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| key | given key |

<a name="CommonModel+setType"></a>

### commonModel.setType(type)
Set the types of the model

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| type | 

<a name="CommonModel+removeType"></a>

### commonModel.removeType(types)
Removes type(s) from model type

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| types | 

<a name="CommonModel+addTypes"></a>

### commonModel.addTypes(types)
Adds types to the existing model types.

Makes sure to only keep a single type incase of duplicates.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| types | which types we should try and add to the existing output |

<a name="CommonModel+isRequired"></a>

### commonModel.isRequired(propertyName) ⇒ <code>boolean</code>
Checks if given property name is required in object

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| propertyName | given property name |

<a name="CommonModel+addItem"></a>

### commonModel.addItem(itemModel, schema, addAsArray)
Adds an item to the model.

If items already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| itemModel | 
| schema | 
| addAsArray | 

<a name="CommonModel+addItemTuple"></a>

### commonModel.addItemTuple(tupleModel, schema, index)
Adds a tuple to the model.

If a item already exist it will be merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| tupleModel | 
| schema | 
| index | 

<a name="CommonModel+addEnum"></a>

### commonModel.addEnum(enumValue)
Add enum value to the model.

Ensures no duplicates are added.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| enumValue | 

<a name="CommonModel+removeEnum"></a>

### commonModel.removeEnum(enumValue)
Remove enum from model.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| enumValue | 

<a name="CommonModel+addProperty"></a>

### commonModel.addProperty(propertyName, propertyModel, schema)
Adds a property to the model.
If the property already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| propertyName |  |
| propertyModel |  |
| schema | schema to the corresponding property model |

<a name="CommonModel+addAdditionalProperty"></a>

### commonModel.addAdditionalProperty(additionalPropertiesModel, schema)
Adds additionalProperty to the model.
If another model already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| additionalPropertiesModel | 
| schema | 

<a name="CommonModel+addAdditionalItems"></a>

### commonModel.addAdditionalItems(additionalItemsModel, schema)
Adds additionalItems to the model.
If another model already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| additionalItemsModel | 
| schema | 

<a name="CommonModel+addPatternProperty"></a>

### commonModel.addPatternProperty(pattern, patternModel, schema)
Adds a patternProperty to the model.
If the pattern already exist the two models are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| pattern |  |
| patternModel |  |
| schema | schema to the corresponding property model |

<a name="CommonModel+addExtendedModel"></a>

### commonModel.addExtendedModel(extendedModel)
Adds another model this model should extend.

It is only allowed to extend if the other model have $id and is not already being extended.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| extendedModel | 

<a name="CommonModel+getNearestDependencies"></a>

### commonModel.getNearestDependencies()
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

<a name="CommonModel.mergeProperties"></a>

### CommonModel.mergeProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Merge two common model properties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

<a name="CommonModel.mergeAdditionalProperties"></a>

### CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Merge two common model additionalProperties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

<a name="CommonModel.mergeAdditionalItems"></a>

### CommonModel.mergeAdditionalItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Merge two common model additionalItems together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

<a name="CommonModel.mergePatternProperties"></a>

### CommonModel.mergePatternProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Merge two common model pattern properties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

<a name="CommonModel.mergeItems"></a>

### CommonModel.mergeItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Merge items together, prefer tuples over simple array since it is more strict.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

<a name="CommonModel.mergeTypes"></a>

### CommonModel.mergeTypes(mergeTo, mergeFrom)
Merge types together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 

<a name="CommonModel.mergeCommonModels"></a>

### CommonModel.mergeCommonModels(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels)
Only merge if left side is undefined and right side is sat OR both sides are defined

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 
| originalSchema | 
| alreadyIteratedModels | 

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
<a name="RenderOutput"></a>

## RenderOutput
Common representation for the rendered output.

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
        * [.tryGetVersionOfDocument(input)](#AsyncAPIInputProcessor+tryGetVersionOfDocument)
    * _static_
        * [.convertToInternalSchema(schema)](#AsyncAPIInputProcessor.convertToInternalSchema)
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

<a name="AsyncAPIInputProcessor+tryGetVersionOfDocument"></a>

### asyncAPIInputProcessor.tryGetVersionOfDocument(input)
Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.

**Kind**: instance method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="AsyncAPIInputProcessor.convertToInternalSchema"></a>

### AsyncAPIInputProcessor.convertToInternalSchema(schema)
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
    * [.setProcessor(type, processor)](#InputProcessor+setProcessor)
    * [.getProcessors()](#InputProcessor+getProcessors) ⇒
    * [.process(input, type)](#InputProcessor+process)

<a name="InputProcessor+setProcessor"></a>

### inputProcessor.setProcessor(type, processor)
Set a processor.

**Kind**: instance method of [<code>InputProcessor</code>](#InputProcessor)  

| Param | Description |
| --- | --- |
| type | of processor |
| processor |  |

<a name="InputProcessor+getProcessors"></a>

### inputProcessor.getProcessors() ⇒
**Kind**: instance method of [<code>InputProcessor</code>](#InputProcessor)  
**Returns**: all processors  
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

<a name="LoggerClass"></a>

## LoggerClass
Logger class for the model generation library

This class acts as a forefront for any external loggers which is why it also implements the interface itself.

**Kind**: global class  
<a name="LoggerClass+setLogger"></a>

### loggerClass.setLogger(logger)
Sets the logger to use for the model generation library

**Kind**: instance method of [<code>LoggerClass</code>](#LoggerClass)  

| Param | Description |
| --- | --- |
| logger | to add |

<a name="DefaultPropertyNames"></a>

## DefaultPropertyNames
Default property names for different aspects of the common model

**Kind**: global variable  
<a name="CommonNamingConventionImplementation"></a>

## CommonNamingConventionImplementation
A CommonNamingConvention implementation shared between generators for different languages.

**Kind**: global variable  
<a name="getUniquePropertyName"></a>

## getUniquePropertyName(rootModel, propertyName)
Recursively find the proper property name.

This function ensures that the property name is unique for the model

**Kind**: global function  

| Param |
| --- |
| rootModel | 
| propertyName | 

<a name="interpretAdditionalItems"></a>

## interpretAdditionalItems(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 additionalProperties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretAdditionalProperties"></a>

## interpretAdditionalProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 additionalProperties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretAllOf"></a>

## interpretAllOf(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 allOf keyword.

It either merges allOf schemas into existing model or if allowed, create inheritance.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretConst"></a>

## interpretConst(schema, model)
Interpreter function for JSON Schema draft 7 const keyword.

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretDependencies"></a>

## interpretDependencies(schema, model)
Interpreter function for JSON Schema draft 7 dependencies keyword.

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretEnum"></a>

## interpretEnum(schema, model)
Interpreter function for JSON Schema draft 7 enum keyword

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretItems"></a>

## interpretItems(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 items keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretArrayItems"></a>

## interpretArrayItems(rootSchema, itemSchemas, model, interpreter, interpreterOptions)
Internal function to process all item schemas

**Kind**: global function  

| Param | Description |
| --- | --- |
| rootSchema |  |
| itemSchemas |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretNot"></a>

## interpretNot(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 not keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretPatternProperties"></a>

## interpretPatternProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for JSON Schema draft 7 patternProperties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretProperties"></a>

## interpretProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for interpreting JSON Schema draft 7 properties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="postInterpretModel"></a>

## postInterpretModel(model)
Post process the interpreted model. By applying the following:
- Ensure models are split as required

**Kind**: global function  

| Param |
| --- |
| model | 

<a name="trySplitModels"></a>

## trySplitModels(model, iteratedModels)
This function splits up a model if needed and add the new model to the list of models.

**Kind**: global function  

| Param | Description |
| --- | --- |
| model | check if it should be split up |
| iteratedModels | which have already been split up |

<a name="ensureModelsAreSplit"></a>

## ensureModelsAreSplit(model, iteratedModels)
Split up all models which should and use ref instead.

**Kind**: global function  

| Param | Description |
| --- | --- |
| model | to ensure are split |
| iteratedModels | which are already split |

<a name="isEnum"></a>

## isEnum(model)
Check if CommonModel is an enum

**Kind**: global function  

| Param |
| --- |
| model | 

<a name="isModelObject"></a>

## isModelObject(model)
Check if CommonModel is a separate model or a simple model.

**Kind**: global function  

| Param |
| --- |
| model | 

<a name="inferTypeFromValue"></a>

## inferTypeFromValue(value)
Infers the JSON Schema type from value

**Kind**: global function  

| Param | Description |
| --- | --- |
| value | to infer type of |

<a name="interpretName"></a>

## interpretName(schema)
Find the name for simplified version of schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the name |

