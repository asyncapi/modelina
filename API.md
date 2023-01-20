## Classes

<dl>
<dt><a href="#AbstractGenerator">AbstractGenerator</a></dt>
<dd><p>Abstract generator which must be implemented by each language</p>
</dd>
<dt><a href="#AbstractRenderer">AbstractRenderer</a></dt>
<dd><p>Abstract renderer with common helper methods</p>
</dd>
<dt><a href="#AsyncapiV2Schema">AsyncapiV2Schema</a></dt>
<dd><p>AsyncAPI schema model</p>
<p>Based on Draft 7 with additions</p>
<p><a href="https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject">https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject</a>
<a href="https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject">https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject</a>
<a href="https://www.asyncapi.com/docs/specifications/v2.2.0#schemaObject">https://www.asyncapi.com/docs/specifications/v2.2.0#schemaObject</a>
<a href="https://www.asyncapi.com/docs/specifications/v2.3.0#schemaObject">https://www.asyncapi.com/docs/specifications/v2.3.0#schemaObject</a></p>
</dd>
<dt><a href="#CommonModel">CommonModel</a></dt>
<dd><p>Common internal representation for a model.</p>
</dd>
<dt><a href="#Draft4Schema">Draft4Schema</a></dt>
<dd><p>JSON Draft 4 schema model</p>
</dd>
<dt><a href="#Draft6Schema">Draft6Schema</a></dt>
<dd><p>JSON Draft 6 schema model</p>
</dd>
<dt><a href="#Draft7Schema">Draft7Schema</a></dt>
<dd><p>JSON Draft7Schema Draft 7 model</p>
</dd>
<dt><a href="#InputMetaModel">InputMetaModel</a></dt>
<dd><p>Since each input processor can create multiple meta models this is a wrapper to a MetaModel to make that possible.</p>
</dd>
<dt><a href="#OpenapiV3Schema">OpenapiV3Schema</a></dt>
<dd><p>OpenAPI 3.0 -&gt; 3.0.4 schema model</p>
<p>Based on Draft 6, but with restricted keywords and definitions
Modifications</p>
<ul>
<li>type, cannot be an array nor contain &#39;null&#39;</li>
</ul>
<p>Restrictions (keywords not allowed)</p>
<ul>
<li>patternProperties</li>
<li>not</li>
</ul>
<p><a href="https://swagger.io/specification/#schema-object">https://swagger.io/specification/#schema-object</a></p>
</dd>
<dt><a href="#OutputModel">OutputModel</a></dt>
<dd><p>Common representation for the output model.</p>
</dd>
<dt><a href="#RenderOutput">RenderOutput</a></dt>
<dd><p>Common representation for the rendered output.</p>
</dd>
<dt><a href="#SwaggerV2Schema">SwaggerV2Schema</a></dt>
<dd><p>OpenAPI 2.0 (Swagger 2.0) schema model</p>
<p>Based on Draft 4, but with restricted keywords and definitions</p>
<p>Restrictions (keywords not allowed)</p>
<ul>
<li>oneOf</li>
<li>anyOf</li>
<li>patternProperties</li>
<li>not</li>
</ul>
<p><a href="https://swagger.io/specification/v2/#schemaObject">https://swagger.io/specification/v2/#schemaObject</a></p>
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
<dt><a href="#OpenAPIInputProcessor">OpenAPIInputProcessor</a></dt>
<dd><p>Class for processing OpenAPI V3.0 inputs</p>
</dd>
<dt><a href="#SwaggerInputProcessor">SwaggerInputProcessor</a></dt>
<dd><p>Class for processing Swagger inputs</p>
</dd>
<dt><a href="#TemplateInputProcessor">TemplateInputProcessor</a></dt>
<dd><p>Class for processing X input</p>
</dd>
<dt><a href="#LoggerClass">LoggerClass</a></dt>
<dd><p>Logger class for the model generation library</p>
<p>This class acts as a forefront for any external loggers which is why it also implements the interface itself.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#convertToUnionModel">convertToUnionModel()</a></dt>
<dd><p>Converts a CommonModel into multiple models wrapped in a union model.</p>
<p>Because a CommonModel might contain multiple models, it&#39;s name for each of those models would be the same, instead we slightly change the model name.
Each model has it&#39;s type as a name prepended to the union name.</p>
<p>If the CommonModel has multiple types</p>
</dd>
<dt><a href="#isDictionary">isDictionary()</a></dt>
<dd><p>Determine whether we have a dictionary or an object. because in some cases inputs might be:
{ &quot;type&quot;: &quot;object&quot;, &quot;additionalProperties&quot;: { &quot;$ref&quot;: &quot;#&quot; } } which is to be interpreted as a dictionary not an object model.</p>
</dd>
<dt><a href="#getOriginalInputFromAdditionalAndPatterns">getOriginalInputFromAdditionalAndPatterns()</a></dt>
<dd><p>Return the original input based on additionalProperties and patternProperties.</p>
</dd>
<dt><a href="#convertAdditionalAndPatterns">convertAdditionalAndPatterns()</a></dt>
<dd><p>Function creating the right meta model based on additionalProperties and patternProperties.</p>
</dd>
<dt><a href="#NO_DUPLICATE_PROPERTIES">NO_DUPLICATE_PROPERTIES(constrainedObjectModel, objectModel, propertyName, namingFormatter)</a></dt>
<dd><p>Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the property names by append, prepend, or manipulate it any other way.
We then need to make sure that they don&#39;t clash with any existing properties, this is what this function handles.
If so, prepend <code>reserved_</code> to the property name and recheck.</p>
</dd>
<dt><a href="#NO_DUPLICATE_ENUM_KEYS">NO_DUPLICATE_ENUM_KEYS(constrainedEnumModel, enumModel, enumKey, namingFormatter, enumKeyToCheck, onNameChange, onNameChangeToCheck)</a> ⇒ <code>string</code></dt>
<dd><p>Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the enum keys by append, prepend, or manipulate it any other way.
We then need to make sure that they don&#39;t clash with any existing enum keys, this is what this function handles.
If so, prepend <code>reserved_</code> to the enum key and recheck.</p>
</dd>
<dt><a href="#renderJavaScriptDependency">renderJavaScriptDependency(toImport, fromModule, moduleSystem)</a></dt>
<dd><p>Function to make it easier to render JS/TS dependencies based on module system</p>
</dd>
<dt><a href="#makeUnique">makeUnique(array)</a></dt>
<dd><p>Function to make an array of ConstrainedMetaModels only contain unique values (ignores different in memory instances)</p>
</dd>
<dt><a href="#lengthInUtf8Bytes">lengthInUtf8Bytes()</a></dt>
<dd><p>Convert a string into utf-8 encoding and return the byte size.</p>
</dd>
<dt><a href="#hasPreset">hasPreset(presets, preset)</a></dt>
<dd><p>Returns true if and only if a given preset is already included in a list of presets
Check is done using referential equality</p>
</dd>
<dt><a href="#trySplitModel">trySplitModel(model, options, models)</a> ⇒</dt>
<dd><p>Try split the model</p>
</dd>
<dt><a href="#split">split(model, options, models)</a> ⇒</dt>
<dd><p>Overwrite the nested models with references where required.</p>
</dd>
<dt><a href="#interpretAdditionalItems">interpretAdditionalItems(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for additionalItems keyword.</p>
</dd>
<dt><a href="#interpretAdditionalProperties">interpretAdditionalProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for additionalProperties keyword.</p>
</dd>
<dt><a href="#interpretAllOf">interpretAllOf(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for allOf keyword.</p>
<p>It either merges allOf schemas into existing model or if allowed, create inheritance.</p>
</dd>
<dt><a href="#interpretAnyOf">interpretAnyOf(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for anyOf keyword.</p>
<p>It puts the schema reference into the items field.</p>
</dd>
<dt><a href="#interpretConst">interpretConst(schema, model)</a></dt>
<dd><p>Interpreter function for const keyword for draft version &gt; 4</p>
</dd>
<dt><a href="#interpretDependencies">interpretDependencies(schema, model)</a></dt>
<dd><p>Interpreter function for dependencies keyword.</p>
</dd>
<dt><a href="#interpretEnum">interpretEnum(schema, model)</a></dt>
<dd><p>Interpreter function for enum keyword</p>
</dd>
<dt><a href="#interpretItems">interpretItems(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for items keyword.</p>
</dd>
<dt><a href="#interpretArrayItems">interpretArrayItems(rootSchema, itemSchemas, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Internal function to process all item schemas</p>
</dd>
<dt><a href="#interpretNot">interpretNot(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for not keyword.</p>
</dd>
<dt><a href="#interpretOneOf">interpretOneOf(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for oneOf keyword.</p>
<p>It puts the schema reference into the items field.</p>
</dd>
<dt><a href="#interpretOneOfWithAllOf">interpretOneOfWithAllOf(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for oneOf keyword combined with the allOf keyword.</p>
<p>It merges the allOf schemas into all of the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.</p>
</dd>
<dt><a href="#interpretOneOfWithProperties">interpretOneOfWithProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for oneOf keyword combined with properties.</p>
<p>It merges the properties of the schema into the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.</p>
</dd>
<dt><a href="#interpretPatternProperties">interpretPatternProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for patternProperties keyword.</p>
</dd>
<dt><a href="#interpretProperties">interpretProperties(schema, model, interpreter, interpreterOptions)</a></dt>
<dd><p>Interpreter function for interpreting properties keyword.</p>
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
<dt><a href="#isClass">isClass(obj)</a></dt>
<dd><p>Return true or false based on whether the input object is a regular object or a class</p>
<p>Taken from: <a href="https://stackoverflow.com/a/43197340/6803886">https://stackoverflow.com/a/43197340/6803886</a></p>
</dd>
<dt><a href="#mergePartialAndDefault">mergePartialAndDefault()</a></dt>
<dd><p>Merge a non optional value with custom optional values to form a full value that has all properties sat.</p>
</dd>
</dl>

<a name="AbstractGenerator"></a>

## AbstractGenerator
Abstract generator which must be implemented by each language

**Kind**: global class  

* [AbstractGenerator](#AbstractGenerator)
    * [.getDependencyManagerInstance()](#AbstractGenerator+getDependencyManagerInstance)
    * [.generateCompleteModels()](#AbstractGenerator+generateCompleteModels)
    * [.generate()](#AbstractGenerator+generate)
    * [.processInput(input)](#AbstractGenerator+processInput)
    * [.getPresets()](#AbstractGenerator+getPresets)

<a name="AbstractGenerator+getDependencyManagerInstance"></a>

### abstractGenerator.getDependencyManagerInstance()
This function returns an instance of the dependency manager which is either a factory or an instance.

**Kind**: instance method of [<code>AbstractGenerator</code>](#AbstractGenerator)  
<a name="AbstractGenerator+generateCompleteModels"></a>

### abstractGenerator.generateCompleteModels()
Generates the full output of a model, instead of a scattered model.

OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.

**Kind**: instance method of [<code>AbstractGenerator</code>](#AbstractGenerator)  
<a name="AbstractGenerator+generate"></a>

### abstractGenerator.generate()
Generates a scattered model where dependencies and rendered results are separated.

**Kind**: instance method of [<code>AbstractGenerator</code>](#AbstractGenerator)  
<a name="AbstractGenerator+processInput"></a>

### abstractGenerator.processInput(input)
Process any of the input formats to the appropriate InputMetaModel type and split out the meta models
based on the requirements of the generators

**Kind**: instance method of [<code>AbstractGenerator</code>](#AbstractGenerator)  

| Param |
| --- |
| input | 

<a name="AbstractGenerator+getPresets"></a>

### abstractGenerator.getPresets()
Get all presets (default and custom ones from options) for a given preset type (class, enum, etc).

**Kind**: instance method of [<code>AbstractGenerator</code>](#AbstractGenerator)  
<a name="AbstractRenderer"></a>

## AbstractRenderer
Abstract renderer with common helper methods

**Kind**: global class  
<a name="AsyncapiV2Schema"></a>

## AsyncapiV2Schema
AsyncAPI schema model

Based on Draft 7 with additions

https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject
https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject
https://www.asyncapi.com/docs/specifications/v2.2.0#schemaObject
https://www.asyncapi.com/docs/specifications/v2.3.0#schemaObject

**Kind**: global class  
<a name="AsyncapiV2Schema.toSchema"></a>

### AsyncapiV2Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of AsyncapiV2Schema.

**Kind**: static method of [<code>AsyncapiV2Schema</code>](#AsyncapiV2Schema)  

| Param |
| --- |
| object | 

<a name="CommonModel"></a>

## CommonModel
Common internal representation for a model.

**Kind**: global class  

* [CommonModel](#CommonModel)
    * _instance_
        * [.getFromOriginalInput(key)](#CommonModel+getFromOriginalInput) ⇒ <code>any</code>
        * [.setType(type)](#CommonModel+setType)
        * [.removeType(types)](#CommonModel+removeType)
        * [.addTypes(types)](#CommonModel+addTypes)
        * [.isRequired(propertyName)](#CommonModel+isRequired) ⇒ <code>boolean</code>
        * [.addItem(itemModel, originalInput)](#CommonModel+addItem)
        * [.addItemTuple(tupleModel, originalInput, index)](#CommonModel+addItemTuple)
        * [.addItemUnion(unionModel)](#CommonModel+addItemUnion)
        * [.addEnum(enumValue)](#CommonModel+addEnum)
        * [.removeEnum(enumValue)](#CommonModel+removeEnum)
        * [.addProperty(propertyName, propertyModel, originalInput)](#CommonModel+addProperty)
        * [.addAdditionalProperty(additionalPropertiesModel, originalInput)](#CommonModel+addAdditionalProperty)
        * [.addPatternProperty(pattern, patternModel, originalInput)](#CommonModel+addPatternProperty)
        * [.addAdditionalItems(additionalItemsModel, originalInput)](#CommonModel+addAdditionalItems)
        * [.addExtendedModel(extendedModel)](#CommonModel+addExtendedModel)
    * _static_
        * [.toCommonModel(object)](#CommonModel.toCommonModel) ⇒
        * [.mergeProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergeProperties)
        * [.mergeAdditionalProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergeAdditionalProperties)
        * [.mergeAdditionalItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergeAdditionalItems)
        * [.mergeItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergeItems)
        * [.mergePatternProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergePatternProperties)
        * [.mergeTypes(mergeTo, mergeFrom)](#CommonModel.mergeTypes)
        * [.mergeCommonModels(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)](#CommonModel.mergeCommonModels)

<a name="CommonModel+getFromOriginalInput"></a>

### commonModel.getFromOriginalInput(key) ⇒ <code>any</code>
Retrieves data from originalInput by given key

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

### commonModel.addItem(itemModel, originalInput)
Adds an item to the model.

If items already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| itemModel |  |
| originalInput | corresponding input that got interpreted to this model |

<a name="CommonModel+addItemTuple"></a>

### commonModel.addItemTuple(tupleModel, originalInput, index)
Adds a tuple to the model.

If a item already exist it will be merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| tupleModel |  |
| originalInput | corresponding input that got interpreted to this model |
| index |  |

<a name="CommonModel+addItemUnion"></a>

### commonModel.addItemUnion(unionModel)
Adds a union model to the model.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| unionModel | 

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

### commonModel.addProperty(propertyName, propertyModel, originalInput)
Adds a property to the model.
If the property already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| propertyName |  |
| propertyModel |  |
| originalInput | corresponding input that got interpreted to this model |

<a name="CommonModel+addAdditionalProperty"></a>

### commonModel.addAdditionalProperty(additionalPropertiesModel, originalInput)
Adds additionalProperty to the model.
If another model already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| additionalPropertiesModel |  |
| originalInput | corresponding input that got interpreted to this model corresponding input that got interpreted to this model |

<a name="CommonModel+addPatternProperty"></a>

### commonModel.addPatternProperty(pattern, patternModel, originalInput)
Adds a patternProperty to the model.
If the pattern already exist the two models are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| pattern |  |
| patternModel |  |
| originalInput | corresponding input that got interpreted to this model |

<a name="CommonModel+addAdditionalItems"></a>

### commonModel.addAdditionalItems(additionalItemsModel, originalInput)
Adds additionalItems to the model.
If another model already exist the two are merged.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| additionalItemsModel |  |
| originalInput | corresponding input that got interpreted to this model |

<a name="CommonModel+addExtendedModel"></a>

### commonModel.addExtendedModel(extendedModel)
Adds another model this model should extend.

It is only allowed to extend if the other model have $id and is not already being extended.

**Kind**: instance method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| extendedModel | 

<a name="CommonModel.toCommonModel"></a>

### CommonModel.toCommonModel(object) ⇒
Takes a deep copy of the input object and converts it to an instance of CommonModel.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  
**Returns**: CommonModel instance of the object  

| Param | Description |
| --- | --- |
| object | to transform |

<a name="CommonModel.mergeProperties"></a>

### CommonModel.mergeProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Merge two common model properties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="CommonModel.mergeAdditionalProperties"></a>

### CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Merge two common model additionalProperties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="CommonModel.mergeAdditionalItems"></a>

### CommonModel.mergeAdditionalItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Merge two common model additionalItems together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="CommonModel.mergeItems"></a>

### CommonModel.mergeItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Merge items together, prefer tuples over simple array since it is more strict.

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="CommonModel.mergePatternProperties"></a>

### CommonModel.mergePatternProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Merge two common model pattern properties together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="CommonModel.mergeTypes"></a>

### CommonModel.mergeTypes(mergeTo, mergeFrom)
Merge types together

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param |
| --- |
| mergeTo | 
| mergeFrom | 

<a name="CommonModel.mergeCommonModels"></a>

### CommonModel.mergeCommonModels(mergeTo, mergeFrom, originalInput, alreadyIteratedModels)
Only merge if left side is undefined and right side is sat OR both sides are defined

**Kind**: static method of [<code>CommonModel</code>](#CommonModel)  

| Param | Description |
| --- | --- |
| mergeTo |  |
| mergeFrom |  |
| originalInput | corresponding input that got interpreted to this model |
| alreadyIteratedModels |  |

<a name="Draft4Schema"></a>

## Draft4Schema
JSON Draft 4 schema model

**Kind**: global class  
<a name="Draft4Schema.toSchema"></a>

### Draft4Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of Draft4Schema.

**Kind**: static method of [<code>Draft4Schema</code>](#Draft4Schema)  

| Param |
| --- |
| object | 

<a name="Draft6Schema"></a>

## Draft6Schema
JSON Draft 6 schema model

**Kind**: global class  
<a name="Draft6Schema.toSchema"></a>

### Draft6Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of Draft6Schema.

**Kind**: static method of [<code>Draft6Schema</code>](#Draft6Schema)  

| Param |
| --- |
| object | 

<a name="Draft7Schema"></a>

## Draft7Schema
JSON Draft7Schema Draft 7 model

**Kind**: global class  
<a name="Draft7Schema.toSchema"></a>

### Draft7Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of Draft7Schema.

**Kind**: static method of [<code>Draft7Schema</code>](#Draft7Schema)  

| Param |
| --- |
| object | 

<a name="InputMetaModel"></a>

## InputMetaModel
Since each input processor can create multiple meta models this is a wrapper to a MetaModel to make that possible.

**Kind**: global class  
<a name="OpenapiV3Schema"></a>

## OpenapiV3Schema
OpenAPI 3.0 -> 3.0.4 schema model

Based on Draft 6, but with restricted keywords and definitions
Modifications
 - type, cannot be an array nor contain 'null'

Restrictions (keywords not allowed)
 - patternProperties
 - not

https://swagger.io/specification/#schema-object

**Kind**: global class  
<a name="OpenapiV3Schema.toSchema"></a>

### OpenapiV3Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of OpenapiV3Schema.

**Kind**: static method of [<code>OpenapiV3Schema</code>](#OpenapiV3Schema)  

| Param |
| --- |
| object | 

<a name="OutputModel"></a>

## OutputModel
Common representation for the output model.

**Kind**: global class  
<a name="RenderOutput"></a>

## RenderOutput
Common representation for the rendered output.

**Kind**: global class  
<a name="SwaggerV2Schema"></a>

## SwaggerV2Schema
OpenAPI 2.0 (Swagger 2.0) schema model

Based on Draft 4, but with restricted keywords and definitions

Restrictions (keywords not allowed)
 - oneOf
 - anyOf
 - patternProperties
 - not

https://swagger.io/specification/v2/#schemaObject

**Kind**: global class  
<a name="SwaggerV2Schema.toSchema"></a>

### SwaggerV2Schema.toSchema(object)
Takes a deep copy of the input object and converts it to an instance of SwaggerV2Schema.

**Kind**: static method of [<code>SwaggerV2Schema</code>](#SwaggerV2Schema)  

| Param |
| --- |
| object | 

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
        * [.isFromParser(input)](#AsyncAPIInputProcessor.isFromParser)
        * [.isFromNewParser(input)](#AsyncAPIInputProcessor.isFromNewParser)

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

<a name="AsyncAPIInputProcessor.isFromParser"></a>

### AsyncAPIInputProcessor.isFromParser(input)
Figure out if input is from the AsyncAPI parser.

**Kind**: static method of [<code>AsyncAPIInputProcessor</code>](#AsyncAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="AsyncAPIInputProcessor.isFromNewParser"></a>

### AsyncAPIInputProcessor.isFromNewParser(input)
Figure out if input is from the new AsyncAPI parser.

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
    * [.process(input, options)](#InputProcessor+process)

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

### inputProcessor.process(input, options)
The processor code which delegates the processing to the correct implementation.

**Kind**: instance method of [<code>InputProcessor</code>](#InputProcessor)  

| Param | Description |
| --- | --- |
| input | to process |
| options | passed to the processors |

<a name="JsonSchemaInputProcessor"></a>

## JsonSchemaInputProcessor
Class for processing JSON Schema

**Kind**: global class  

* [JsonSchemaInputProcessor](#JsonSchemaInputProcessor)
    * _instance_
        * [.process(input)](#JsonSchemaInputProcessor+process)
        * [.shouldProcess(input)](#JsonSchemaInputProcessor+shouldProcess)
        * [.processDraft7(input)](#JsonSchemaInputProcessor+processDraft7)
        * [.processDraft4(input)](#JsonSchemaInputProcessor+processDraft4)
        * [.processDraft6(input)](#JsonSchemaInputProcessor+processDraft6)
        * [.handleRootReference()](#JsonSchemaInputProcessor+handleRootReference)
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
Process a draft-7 schema

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| input | to process as draft 7 |

<a name="JsonSchemaInputProcessor+processDraft4"></a>

### jsonSchemaInputProcessor.processDraft4(input)
Process a draft-4 schema

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| input | to process as draft 4 |

<a name="JsonSchemaInputProcessor+processDraft6"></a>

### jsonSchemaInputProcessor.processDraft6(input)
Process a draft-6 schema

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  

| Param | Description |
| --- | --- |
| input | to process as draft-6 |

<a name="JsonSchemaInputProcessor+handleRootReference"></a>

### jsonSchemaInputProcessor.handleRootReference()
This is a hotfix and really only a partial solution as it does not cover all cases.

But it's the best we can do until we find or build a better library to handle references.

**Kind**: instance method of [<code>JsonSchemaInputProcessor</code>](#JsonSchemaInputProcessor)  
<a name="JsonSchemaInputProcessor.reflectSchemaNames"></a>

### JsonSchemaInputProcessor.reflectSchemaNames(schema, namesStack, name, isRoot)
Each schema must have a name, so when later interpreted, the model have the most accurate model name.

Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.

This reflects all the common keywords that are shared between draft-4, draft-7 and Swagger 2.0 Schema

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

<a name="OpenAPIInputProcessor"></a>

## OpenAPIInputProcessor
Class for processing OpenAPI V3.0 inputs

**Kind**: global class  

* [OpenAPIInputProcessor](#OpenAPIInputProcessor)
    * _instance_
        * [.process(input)](#OpenAPIInputProcessor+process)
        * [.shouldProcess(input)](#OpenAPIInputProcessor+shouldProcess)
        * [.tryGetVersionOfDocument(input)](#OpenAPIInputProcessor+tryGetVersionOfDocument)
    * _static_
        * [.convertToInternalSchema(schema, name)](#OpenAPIInputProcessor.convertToInternalSchema)

<a name="OpenAPIInputProcessor+process"></a>

### openAPIInputProcessor.process(input)
Process the input as a OpenAPI V3.0 document

**Kind**: instance method of [<code>OpenAPIInputProcessor</code>](#OpenAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="OpenAPIInputProcessor+shouldProcess"></a>

### openAPIInputProcessor.shouldProcess(input)
Figures out if an object is of type OpenAPI V3.0.x document and supported

**Kind**: instance method of [<code>OpenAPIInputProcessor</code>](#OpenAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="OpenAPIInputProcessor+tryGetVersionOfDocument"></a>

### openAPIInputProcessor.tryGetVersionOfDocument(input)
Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.

**Kind**: instance method of [<code>OpenAPIInputProcessor</code>](#OpenAPIInputProcessor)  

| Param |
| --- |
| input | 

<a name="OpenAPIInputProcessor.convertToInternalSchema"></a>

### OpenAPIInputProcessor.convertToInternalSchema(schema, name)
Converts a schema to the internal schema format.

**Kind**: static method of [<code>OpenAPIInputProcessor</code>](#OpenAPIInputProcessor)  

| Param | Description |
| --- | --- |
| schema | to convert |
| name | of the schema |

<a name="SwaggerInputProcessor"></a>

## SwaggerInputProcessor
Class for processing Swagger inputs

**Kind**: global class  

* [SwaggerInputProcessor](#SwaggerInputProcessor)
    * _instance_
        * [.process(input)](#SwaggerInputProcessor+process)
        * [.shouldProcess(input)](#SwaggerInputProcessor+shouldProcess)
        * [.tryGetVersionOfDocument(input)](#SwaggerInputProcessor+tryGetVersionOfDocument)
    * _static_
        * [.convertToInternalSchema(schema, name)](#SwaggerInputProcessor.convertToInternalSchema)

<a name="SwaggerInputProcessor+process"></a>

### swaggerInputProcessor.process(input)
Process the input as a Swagger document

**Kind**: instance method of [<code>SwaggerInputProcessor</code>](#SwaggerInputProcessor)  

| Param |
| --- |
| input | 

<a name="SwaggerInputProcessor+shouldProcess"></a>

### swaggerInputProcessor.shouldProcess(input)
Figures out if an object is of type Swagger document and supported

**Kind**: instance method of [<code>SwaggerInputProcessor</code>](#SwaggerInputProcessor)  

| Param |
| --- |
| input | 

<a name="SwaggerInputProcessor+tryGetVersionOfDocument"></a>

### swaggerInputProcessor.tryGetVersionOfDocument(input)
Try to find the swagger version from the input. If it cannot, undefined are returned, if it can, the version is returned.

**Kind**: instance method of [<code>SwaggerInputProcessor</code>](#SwaggerInputProcessor)  

| Param |
| --- |
| input | 

<a name="SwaggerInputProcessor.convertToInternalSchema"></a>

### SwaggerInputProcessor.convertToInternalSchema(schema, name)
Converts a Swagger 2.0 Schema to the internal schema format.

**Kind**: static method of [<code>SwaggerInputProcessor</code>](#SwaggerInputProcessor)  

| Param | Description |
| --- | --- |
| schema | to convert |
| name | of the schema |

<a name="TemplateInputProcessor"></a>

## TemplateInputProcessor
Class for processing X input

**Kind**: global class  
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

<a name="convertToUnionModel"></a>

## convertToUnionModel()
Converts a CommonModel into multiple models wrapped in a union model.

Because a CommonModel might contain multiple models, it's name for each of those models would be the same, instead we slightly change the model name.
Each model has it's type as a name prepended to the union name.

If the CommonModel has multiple types

**Kind**: global function  
<a name="isDictionary"></a>

## isDictionary()
Determine whether we have a dictionary or an object. because in some cases inputs might be:
{ "type": "object", "additionalProperties": { "$ref": "#" } } which is to be interpreted as a dictionary not an object model.

**Kind**: global function  
<a name="getOriginalInputFromAdditionalAndPatterns"></a>

## getOriginalInputFromAdditionalAndPatterns()
Return the original input based on additionalProperties and patternProperties.

**Kind**: global function  
<a name="convertAdditionalAndPatterns"></a>

## convertAdditionalAndPatterns()
Function creating the right meta model based on additionalProperties and patternProperties.

**Kind**: global function  
<a name="NO_DUPLICATE_PROPERTIES"></a>

## NO\_DUPLICATE\_PROPERTIES(constrainedObjectModel, objectModel, propertyName, namingFormatter)
Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the property names by append, prepend, or manipulate it any other way.
We then need to make sure that they don't clash with any existing properties, this is what this function handles.
If so, prepend `reserved_` to the property name and recheck.

**Kind**: global function  

| Param | Description |
| --- | --- |
| constrainedObjectModel | the current constrained object model, which contains already existing constrained properties |
| objectModel | the raw object model which is non-constrained to the output language. |
| propertyName | one of the properties in objectModel which might have been manipulated |
| namingFormatter | the name formatter which are used to format the property key |

<a name="NO_DUPLICATE_ENUM_KEYS"></a>

## NO\_DUPLICATE\_ENUM\_KEYS(constrainedEnumModel, enumModel, enumKey, namingFormatter, enumKeyToCheck, onNameChange, onNameChangeToCheck) ⇒ <code>string</code>
Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the enum keys by append, prepend, or manipulate it any other way.
We then need to make sure that they don't clash with any existing enum keys, this is what this function handles.
If so, prepend `reserved_` to the enum key and recheck.

**Kind**: global function  
**Returns**: <code>string</code> - the potential new enum key that does not clash with existing enum keys.  

| Param | Description |
| --- | --- |
| constrainedEnumModel | the current constrained enum model, which contains already existing constrained enum keys |
| enumModel | the raw enum model which is non-constrained to the output language. |
| enumKey | one of the enum keys in enumModel which might have been manipulated. |
| namingFormatter | the name formatter which are used to format the enum key. |
| enumKeyToCheck | the enum key to use for checking if it already exist, defaults to enumKey. |
| onNameChange | callback to change the name of the enum key that needs to be returned. |
| onNameChangeToCheck | callback to change the enum key which is being checked as part of the existing models. |

<a name="renderJavaScriptDependency"></a>

## renderJavaScriptDependency(toImport, fromModule, moduleSystem)
Function to make it easier to render JS/TS dependencies based on module system

**Kind**: global function  

| Param |
| --- |
| toImport | 
| fromModule | 
| moduleSystem | 

<a name="makeUnique"></a>

## makeUnique(array)
Function to make an array of ConstrainedMetaModels only contain unique values (ignores different in memory instances)

**Kind**: global function  

| Param | Description |
| --- | --- |
| array | to make unique |

<a name="lengthInUtf8Bytes"></a>

## lengthInUtf8Bytes()
Convert a string into utf-8 encoding and return the byte size.

**Kind**: global function  
<a name="hasPreset"></a>

## hasPreset(presets, preset)
Returns true if and only if a given preset is already included in a list of presets
Check is done using referential equality

**Kind**: global function  

| Param | Description |
| --- | --- |
| presets | the list to check |
| preset | the preset to check for |

<a name="trySplitModel"></a>

## trySplitModel(model, options, models) ⇒
Try split the model

**Kind**: global function  
**Returns**: whether the new or old MetaModel to use.  

| Param |
| --- |
| model | 
| options | 
| models | 

<a name="split"></a>

## split(model, options, models) ⇒
Overwrite the nested models with references where required.

**Kind**: global function  
**Returns**: an array of all the split models  

| Param |
| --- |
| model | 
| options | 
| models | 

<a name="interpretAdditionalItems"></a>

## interpretAdditionalItems(schema, model, interpreter, interpreterOptions)
Interpreter function for additionalItems keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretAdditionalProperties"></a>

## interpretAdditionalProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for additionalProperties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretAllOf"></a>

## interpretAllOf(schema, model, interpreter, interpreterOptions)
Interpreter function for allOf keyword.

It either merges allOf schemas into existing model or if allowed, create inheritance.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretAnyOf"></a>

## interpretAnyOf(schema, model, interpreter, interpreterOptions)
Interpreter function for anyOf keyword.

It puts the schema reference into the items field.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretConst"></a>

## interpretConst(schema, model)
Interpreter function for const keyword for draft version > 4

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretDependencies"></a>

## interpretDependencies(schema, model)
Interpreter function for dependencies keyword.

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretEnum"></a>

## interpretEnum(schema, model)
Interpreter function for enum keyword

**Kind**: global function  

| Param |
| --- |
| schema | 
| model | 

<a name="interpretItems"></a>

## interpretItems(schema, model, interpreter, interpreterOptions)
Interpreter function for items keyword.

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
Interpreter function for not keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretOneOf"></a>

## interpretOneOf(schema, model, interpreter, interpreterOptions)
Interpreter function for oneOf keyword.

It puts the schema reference into the items field.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretOneOfWithAllOf"></a>

## interpretOneOfWithAllOf(schema, model, interpreter, interpreterOptions)
Interpreter function for oneOf keyword combined with the allOf keyword.

It merges the allOf schemas into all of the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretOneOfWithProperties"></a>

## interpretOneOfWithProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for oneOf keyword combined with properties.

It merges the properties of the schema into the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretPatternProperties"></a>

## interpretPatternProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for patternProperties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

<a name="interpretProperties"></a>

## interpretProperties(schema, model, interpreter, interpreterOptions)
Interpreter function for interpreting properties keyword.

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema |  |
| model |  |
| interpreter |  |
| interpreterOptions | to control the interpret process |

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

<a name="isClass"></a>

## isClass(obj)
Return true or false based on whether the input object is a regular object or a class

Taken from: https://stackoverflow.com/a/43197340/6803886

**Kind**: global function  

| Param |
| --- |
| obj | 

<a name="mergePartialAndDefault"></a>

## mergePartialAndDefault()
Merge a non optional value with custom optional values to form a full value that has all properties sat.

**Kind**: global function  
