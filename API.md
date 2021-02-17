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
<dd><p>Common representation for the renderers.</p>
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
<dt><a href="#simplifyExtend">simplifyExtend(schema)</a></dt>
<dd><p>Find out which common models we should extend</p>
</dd>
<dt><a href="#simplifyItems">simplifyItems(schema, simplifier, seenSchemas)</a></dt>
<dd><p>Find the items for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyProperties">simplifyProperties(schema, simplifier, seenSchemas)</a></dt>
<dd><p>Simplifier function for finding the simplified version of properties.</p>
</dd>
<dt><a href="#simplifyRequired">simplifyRequired(schema, seenSchemas)</a></dt>
<dd><p>Find the required array for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyTypes">simplifyTypes(schema, seenSchemas)</a></dt>
<dd><p>Find the types for a simplified version of a schema</p>
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
Common representation for the renderers.

**Kind**: global class  
**Extends**: [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)  

* [CommonModel](#CommonModel) ⇐ [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)
    * _instance_
        * [.getFromSchema(key)](#CommonModel+getFromSchema) ⇒ <code>any</code>
        * [.isRequired(propertyName)](#CommonModel+isRequired) ⇒ <code>boolean</code>
    * _static_
        * [.toCommonModel(object)](#CommonModel.toCommonModel) ⇒
        * [.mergeCommonModels(mergeTo, mergeFrom)](#CommonModel.mergeCommonModels)

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

<a name="CommonModel.toCommonModel"></a>

### CommonModel.toCommonModel(object) ⇒
Transform object into a type of CommonModel.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  
**Returns**: CommonModel instance of the object  

| Param | Description |
| --- | --- |
| object | to transform |

<a name="CommonModel.mergeCommonModels"></a>

### CommonModel.mergeCommonModels(mergeTo, mergeFrom)
Only merge if left side is undefined and right side is sat OR both sides are defined

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo | CommonModel to merge into |
| mergeFrom | CommonModel to merge values from |

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

<a name="simplifyExtend"></a>

## simplifyExtend(schema)
Find out which common models we should extend

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find extends of |

<a name="simplifyItems"></a>

## simplifyItems(schema, simplifier, seenSchemas)
Find the items for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified items for |
| simplifier | the simplifier instance |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

<a name="simplifyProperties"></a>

## simplifyProperties(schema, simplifier, seenSchemas)
Simplifier function for finding the simplified version of properties.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | the schema to simplify properties for |
| simplifier | the simplifier instance |
| seenSchemas | already seen schemas and their corresponding output, this is to avoid circular schemas |

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

<a name="isModelObject"></a>

## isModelObject()
check if CommonModel is a separate model or a simple model.

**Kind**: global function  
