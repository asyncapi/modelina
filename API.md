## Members

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
<dt><a href="#simplifyEnums">simplifyEnums(schema)</a></dt>
<dd><p>Find the enums for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyItems">simplifyItems(schema)</a></dt>
<dd><p>Find the enums for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyProperties">simplifyProperties(schema)</a></dt>
<dd><p>Find the enums for a simplified version of a schema</p>
</dd>
<dt><a href="#simplifyTypes">simplifyTypes(schema)</a></dt>
<dd><p>Find the types for a simplified version of a schema</p>
</dd>
</dl>

<a name="AbstractGenerator"></a>

## AbstractGenerator
Abstract generator which must be implemented by each language

**Kind**: global variable  
<a name="AbstractRenderer"></a>

## AbstractRenderer
Abstract renderer with common helper methods

**Kind**: global variable  
<a name="CommonInputModel"></a>

## CommonInputModel
This class is the wrapper for simplified models and the rest of the context needed for further generate typed models.

**Kind**: global variable  
<a name="CommonModel"></a>

## CommonModel ⇐ [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)
Common representation for the renderers.

**Kind**: global variable  
**Extends**: [<code>CommonSchema&lt;CommonModel&gt;</code>](#CommonModel)  
<a name="CommonSchema"></a>

## CommonSchema
CommonSchema which contains the common properties between Schema and CommonModel

**Kind**: global variable  
<a name="OutputModel"></a>

## OutputModel
Common representation for the output model.

**Kind**: global variable  
<a name="Schema"></a>

## Schema ⇐ [<code>CommonSchema&lt;Schema&gt;</code>](#Schema)
JSON Schema Draft 7 model

**Kind**: global variable  
**Extends**: [<code>CommonSchema&lt;Schema&gt;</code>](#Schema)  
<a name="InputProcessor"></a>

## InputProcessor
Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.

**Kind**: global variable  
<a name="JsonSchemaInputProcessor"></a>

## JsonSchemaInputProcessor
Class for processing JSON Schema

**Kind**: global variable  
<a name="simplifyEnums"></a>

## simplifyEnums(schema)
Find the enums for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified enums for |

<a name="simplifyItems"></a>

## simplifyItems(schema)
Find the enums for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified enums for |

<a name="simplifyProperties"></a>

## simplifyProperties(schema)
Find the enums for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified enums for |

<a name="simplifyTypes"></a>

## simplifyTypes(schema)
Find the types for a simplified version of a schema

**Kind**: global function  

| Param | Description |
| --- | --- |
| schema | to find the simplified types for |

