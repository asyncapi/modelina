# Interpretation of XSD to MetaModel

The library transforms XSD (XML Schema Definition) from XML data validation schemas to data model representations ([`MetaModel`](../internal-model.md)s). 

The algorithm processes the XSD document structure to create models that represent the data types defined in the schema, including complex types, simple types, elements, attributes, and their relationships.

## Overview

XSD input processing follows this flow:
1. **XML Parsing**: The XSD string is parsed into a JavaScript object using `fast-xml-parser`
2. **XSD Schema Model**: The parsed XML is converted to a structured `XsdSchema` model
3. **MetaModel Conversion**: The XSD types are mapped to Modelina's internal `MetaModel` representation
4. **Model Generation**: The MetaModels are processed by generators to create output code

## Supported XSD Features

### Simple Types
- **Enumerations**: `xs:restriction` with `xs:enumeration` values → enum models
- **Restrictions**: Patterns, length constraints, and numeric ranges (constraint information preserved in original input)

### Complex Types
- **Sequences**: `xs:sequence` elements → object properties in defined order
- **Choices**: `xs:choice` elements → optional object properties
- **Attributes**: Converted to object properties alongside elements
  - `use="required"` → required properties
  - `use="optional"` → optional properties

### Advanced Features
- **Complex Content (Inheritance)**: `xs:complexContent` with `xs:extension`
  - Currently: Properties from base type are merged into extending type
  - Note: Full inheritance support may be added in future versions
- **Simple Content**: Text content plus attributes → object with `value` property
- **Arrays**: `maxOccurs="unbounded"` or `maxOccurs` > 1 → array properties
- **Optional Elements**: `minOccurs="0"` → non-required properties
- **Wildcards**: `xs:any` elements → mapped to `any` type
  - Supports `minOccurs` and `maxOccurs` for cardinality
  - Generated as properties with names like `additionalProperty`, `additionalProperty1`, etc.

## Type Mappings

The following table shows how XSD built-in types are mapped to Modelina's internal types:

| XSD Type | Mapped Type | Notes |
|----------|-------------|-------|
| `xs:string`, `xs:token`, `xs:normalizedString` | string | General text types |
| `xs:int`, `xs:integer`, `xs:long`, `xs:short`, `xs:byte` | integer | Integer numeric types |
| `xs:unsignedLong`, `xs:unsignedInt`, `xs:unsignedShort`, `xs:unsignedByte` | integer | Unsigned integer types |
| `xs:positiveInteger`, `xs:negativeInteger`, `xs:nonPositiveInteger`, `xs:nonNegativeInteger` | integer | Constrained integer types |
| `xs:float`, `xs:double`, `xs:decimal` | float | Floating-point numeric types |
| `xs:boolean` | boolean | Boolean type |
| `xs:date`, `xs:time`, `xs:dateTime`, `xs:duration` | string | Date/time types (represented as strings) |
| `xs:gYear`, `xs:gMonth`, `xs:gDay` | string | Partial date types |
| `xs:anyURI`, `xs:QName` | string | URI and qualified name types |
| `xs:base64Binary`, `xs:hexBinary` | string | Binary data types (represented as strings) |
| Complex types | object | Converted to object models with properties |
| Simple types with enumerations | enum | Converted to enum models |

## Namespace Handling

XSD namespaces are handled in a simplified manner:
- `targetNamespace` is extracted but not actively used
- Both `xs:` and `xsd:` prefixes are supported
- Custom namespace prefixes (e.g., `tns:BookType`) are stripped and resolved by name only

## Limitations

### Partial Support
- **Element References**: `ref` attribute has basic support
- **Union/List**: `xs:union` and `xs:list` have basic implementations
- **Inheritance**: Properties are merged rather than creating true inheritance

### Not Supported
- `xs:group` and `xs:attributeGroup` (named groups)
- `xs:unique`, `xs:key`, `xs:keyref` (constraints)
- `xs:notation` and `xs:redefine`
- Full `xs:restriction` on complex types
- `substitutionGroup` (element substitution)
- Full namespace handling and validation
- Constraint enforcement in generated models (patterns, lengths, ranges)

## Examples

See the [XSD to TypeScript example](../../examples/xsd-to-typescript/) for a complete working demonstration of XSD input processing.

For general usage information, see the [usage documentation](https://github.com/asyncapi/modelina/blob/master/docs/usage.md#generate-models-from-xsd-documents).

