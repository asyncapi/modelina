# XSD xs:any Support Example

This example demonstrates how Modelina handles `xs:any` elements in XSD schemas, which are wildcards that allow any element from any namespace.

## Key Features Demonstrated

- **Optional xs:any with arrays**: `minOccurs="0" maxOccurs="unbounded"` generates optional array of any
- **Required xs:any**: `minOccurs="1"` generates required any property
- **xs:any in choice**: xs:any elements in choice constructs are treated as optional

## Generated Output

`xs:any` elements are mapped to the `any` type and generated as properties with names like:
- `additionalProperty` (for the first xs:any)
- `additionalProperty1`, `additionalProperty2`, etc. (for subsequent xs:any elements)

## Running the Example

```bash
npm run examples:xsd-any-support
```

## XSD Constructs Used

- `xs:any` - Wildcard element
- `minOccurs` and `maxOccurs` - Cardinality control
- `processContents` - Validation hint (preserved but not enforced in generated code)
- `xs:choice` - Choice construct with xs:any

