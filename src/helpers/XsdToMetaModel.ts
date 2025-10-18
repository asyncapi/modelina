/* eslint-disable security/detect-object-injection */
// Note: security/detect-object-injection disabled for this file as we use
// dynamic property access for XML/XSD parsing which is safe in this context

import {
  MetaModel,
  ObjectModel,
  ObjectPropertyModel,
  StringModel,
  IntegerModel,
  FloatModel,
  BooleanModel,
  EnumModel,
  EnumValueModel,
  ArrayModel,
  AnyModel,
  UnionModel,
  MetaModelOptions
} from '../models';
import {
  XsdSchema,
  XsdElement,
  XsdComplexType,
  XsdSimpleType
} from '../models/XsdSchema';
import { Logger } from '../utils';

// Map XSD built-in types to MetaModel types
const XSD_TYPE_MAPPING: { [key: string]: string } = {
  // String types
  'xs:string': 'string',
  'xsd:string': 'string',
  'xs:token': 'string',
  'xsd:token': 'string',
  'xs:normalizedString': 'string',
  'xsd:normalizedString': 'string',
  'xs:anyURI': 'string',
  'xsd:anyURI': 'string',
  'xs:QName': 'string',
  'xsd:QName': 'string',

  // Numeric types - integers
  'xs:int': 'integer',
  'xsd:int': 'integer',
  'xs:integer': 'integer',
  'xsd:integer': 'integer',
  'xs:long': 'integer',
  'xsd:long': 'integer',
  'xs:short': 'integer',
  'xsd:short': 'integer',
  'xs:byte': 'integer',
  'xsd:byte': 'integer',
  'xs:nonNegativeInteger': 'integer',
  'xsd:nonNegativeInteger': 'integer',
  'xs:positiveInteger': 'integer',
  'xsd:positiveInteger': 'integer',
  'xs:nonPositiveInteger': 'integer',
  'xsd:nonPositiveInteger': 'integer',
  'xs:negativeInteger': 'integer',
  'xsd:negativeInteger': 'integer',
  'xs:unsignedLong': 'integer',
  'xsd:unsignedLong': 'integer',
  'xs:unsignedInt': 'integer',
  'xsd:unsignedInt': 'integer',
  'xs:unsignedShort': 'integer',
  'xsd:unsignedShort': 'integer',
  'xs:unsignedByte': 'integer',
  'xsd:unsignedByte': 'integer',

  // Numeric types - floats
  'xs:float': 'float',
  'xsd:float': 'float',
  'xs:double': 'float',
  'xsd:double': 'float',
  'xs:decimal': 'float',
  'xsd:decimal': 'float',

  // Boolean types
  'xs:boolean': 'boolean',
  'xsd:boolean': 'boolean',

  // Date/time types (treated as strings)
  'xs:date': 'string',
  'xsd:date': 'string',
  'xs:time': 'string',
  'xsd:time': 'string',
  'xs:dateTime': 'string',
  'xsd:dateTime': 'string',
  'xs:duration': 'string',
  'xsd:duration': 'string',
  'xs:gYear': 'string',
  'xsd:gYear': 'string',
  'xs:gMonth': 'string',
  'xsd:gMonth': 'string',
  'xs:gDay': 'string',
  'xsd:gDay': 'string',

  // Binary types (treated as strings for now)
  'xs:base64Binary': 'string',
  'xsd:base64Binary': 'string',
  'xs:hexBinary': 'string',
  'xsd:hexBinary': 'string'
};

/**
 * Process complex types and add to registry
 */
function processComplexTypes(
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  metaModels: MetaModel[]
): void {
  if (!xsdSchema.complexTypes) {
    return;
  }

  for (const complexType of xsdSchema.complexTypes) {
    if (complexType.name) {
      const model = complexTypeToMetaModel(
        complexType,
        xsdSchema,
        typeRegistry
      );
      typeRegistry.set(complexType.name, model);
      metaModels.push(model);
    }
  }
}

/**
 * Process simple types and add to registry
 */
function processSimpleTypes(
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  metaModels: MetaModel[]
): void {
  if (!xsdSchema.simpleTypes) {
    return;
  }

  for (const simpleType of xsdSchema.simpleTypes) {
    if (simpleType.name) {
      const model = simpleTypeToMetaModel(simpleType, xsdSchema, typeRegistry);
      typeRegistry.set(simpleType.name, model);
      metaModels.push(model);
    }
  }
}

/**
 * Process root elements and add to models
 */
function processRootElements(
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  metaModels: MetaModel[]
): void {
  if (!xsdSchema.elements) {
    return;
  }

  for (const element of xsdSchema.elements) {
    if (element.name) {
      const model = elementToMetaModel(element, xsdSchema, typeRegistry);
      if (model) {
        metaModels.push(model);
      }
    }
  }
}

/**
 * Convert XSD Schema to MetaModel(s)
 *
 * @param xsdSchema The parsed XSD schema
 * @returns Array of MetaModels representing the XSD types
 */
export function XsdToMetaModel(xsdSchema: XsdSchema): MetaModel[] {
  const metaModels: MetaModel[] = [];
  const typeRegistry: Map<string, MetaModel> = new Map();

  // First pass: Create models for all named complex and simple types
  processComplexTypes(xsdSchema, typeRegistry, metaModels);
  processSimpleTypes(xsdSchema, typeRegistry, metaModels);

  // Second pass: Create models for root elements
  processRootElements(xsdSchema, typeRegistry, metaModels);

  // If no models were created, create a default one
  if (metaModels.length === 0) {
    Logger.warn(
      'No models could be generated from XSD schema, creating default model'
    );
    metaModels.push(new AnyModel('Root', xsdSchema.originalInput, {}));
  }

  return metaModels;
}

/**
 * Convert XSD element to MetaModel
 */
function elementToMetaModel(
  element: XsdElement,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>
): MetaModel | undefined {
  const name = element.name || 'AnonymousElement';
  const options: MetaModelOptions = {
    isNullable: element.minOccurs === '0' || element.minOccurs === 0
  };

  // If element has a type reference, resolve it
  if (element.type) {
    const mappedType = XSD_TYPE_MAPPING[element.type];
    if (mappedType) {
      return createPrimitiveModel(
        name,
        mappedType,
        options,
        xsdSchema.originalInput
      );
    }

    // Check if it's a custom type in the registry
    const customType = typeRegistry.get(element.type);
    if (customType) {
      // Return a reference or copy of the custom type with the element name
      return customType;
    }
  }

  // If element has inline complex type
  if (element.complexType) {
    return complexTypeToMetaModel(
      element.complexType,
      xsdSchema,
      typeRegistry,
      name
    );
  }

  // If element has inline simple type
  if (element.simpleType) {
    return simpleTypeToMetaModel(
      element.simpleType,
      xsdSchema,
      typeRegistry,
      name
    );
  }

  // Default to string if type is not specified
  return new StringModel(name, xsdSchema.originalInput, options);
}

/**
 * Process sequence elements and add to properties
 */
function processSequenceElements(
  complexType: XsdComplexType,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  if (!complexType.sequence?.elements) {
    return;
  }

  for (const element of complexType.sequence.elements) {
    if (element.name) {
      const propertyModel = elementToPropertyModel(
        element,
        xsdSchema,
        typeRegistry
      );
      if (propertyModel) {
        properties[element.name] = propertyModel;
      }
    }
  }
}

/**
 * Process xs:any in sequence and add to properties
 */
function processSequenceAny(
  complexType: XsdComplexType,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  if (!complexType.sequence?.any) {
    return;
  }

  for (let i = 0; i < complexType.sequence.any.length; i++) {
    const anyElement = complexType.sequence.any[i];
    const propertyModel = anyToPropertyModel(anyElement, i);
    if (propertyModel) {
      properties[propertyModel.propertyName] = propertyModel;
    }
  }
}

/**
 * Process choice elements and add to properties (as optional)
 */
function processChoiceElements(
  complexType: XsdComplexType,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  if (!complexType.choice?.elements) {
    return;
  }

  for (const element of complexType.choice.elements) {
    if (element.name) {
      const propertyModel = elementToPropertyModel(
        element,
        xsdSchema,
        typeRegistry
      );
      if (propertyModel) {
        propertyModel.required = false; // Choice elements are optional
        properties[element.name] = propertyModel;
      }
    }
  }
}

/**
 * Process xs:any in choice and add to properties (as optional)
 */
function processChoiceAny(
  complexType: XsdComplexType,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  if (!complexType.choice?.any) {
    return;
  }

  for (let i = 0; i < complexType.choice.any.length; i++) {
    const anyElement = complexType.choice.any[i];
    const propertyModel = anyToPropertyModel(anyElement, i);
    if (propertyModel) {
      propertyModel.required = false; // Choice elements are optional
      properties[propertyModel.propertyName] = propertyModel;
    }
  }
}

/**
 * Process attributes and add to properties
 */
function processAttributes(
  attributes: any[] | undefined,
  xsdSchema: XsdSchema,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  if (!attributes) {
    return;
  }

  for (const attribute of attributes) {
    if (attribute.name) {
      const propertyModel = attributeToPropertyModel(attribute, xsdSchema);
      if (propertyModel) {
        properties[attribute.name] = propertyModel;
      }
    }
  }
}

/**
 * Process complex content extension and add to properties
 */
function processComplexContentExtension(
  complexType: XsdComplexType,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  const extension = complexType.complexContent?.extension;
  if (!extension) {
    return;
  }

  // Add properties from extension sequence
  if (extension.sequence?.elements) {
    for (const element of extension.sequence.elements) {
      if (element.name) {
        const propertyModel = elementToPropertyModel(
          element,
          xsdSchema,
          typeRegistry
        );
        if (propertyModel) {
          properties[element.name] = propertyModel;
        }
      }
    }
  }

  // Add attributes from extension
  processAttributes(extension.attributes, xsdSchema, properties);
}

/**
 * Process simple content extension and add to properties
 */
function processSimpleContentExtension(
  complexType: XsdComplexType,
  xsdSchema: XsdSchema,
  properties: { [key: string]: ObjectPropertyModel }
): void {
  const extension = complexType.simpleContent?.extension;
  if (!extension) {
    return;
  }

  // Add a 'value' property for the text content
  const baseType = extension.base || 'xs:string';
  const mappedType = XSD_TYPE_MAPPING[baseType] || 'string';
  const valueModel = createPrimitiveModel(
    'value',
    mappedType,
    {},
    xsdSchema.originalInput
  );
  properties['value'] = new ObjectPropertyModel('value', true, valueModel);

  // Add attributes from extension
  processAttributes(extension.attributes, xsdSchema, properties);
}

/**
 * Convert XSD complexType to MetaModel (ObjectModel)
 */
function complexTypeToMetaModel(
  complexType: XsdComplexType,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  overrideName?: string
): MetaModel {
  const name = overrideName || complexType.name || 'AnonymousComplexType';
  const properties: { [key: string]: ObjectPropertyModel } = {};

  processSequenceElements(complexType, xsdSchema, typeRegistry, properties);
  processSequenceAny(complexType, properties);
  processChoiceElements(complexType, xsdSchema, typeRegistry, properties);
  processChoiceAny(complexType, properties);
  processAttributes(complexType.attributes, xsdSchema, properties);
  processComplexContentExtension(
    complexType,
    xsdSchema,
    typeRegistry,
    properties
  );
  processSimpleContentExtension(complexType, xsdSchema, properties);

  return new ObjectModel(name, xsdSchema.originalInput, {}, properties);
}

/**
 * Convert XSD simpleType to MetaModel (usually EnumModel or StringModel with constraints)
 */
function simpleTypeToMetaModel(
  simpleType: XsdSimpleType,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>,
  overrideName?: string
): MetaModel {
  const name = overrideName || simpleType.name || 'AnonymousSimpleType';

  // Handle restriction with enumeration
  if (simpleType.restriction?.enumeration) {
    const enumValues = simpleType.restriction.enumeration.map((value) => {
      return new EnumValueModel(String(value), value);
    });
    return new EnumModel(name, xsdSchema.originalInput, {}, enumValues);
  }

  // Handle restriction with pattern or length constraints (treated as string)
  if (simpleType.restriction) {
    const baseType = simpleType.restriction.base || 'xs:string';
    const mappedType = XSD_TYPE_MAPPING[baseType] || 'string';
    return createPrimitiveModel(name, mappedType, {}, xsdSchema.originalInput);
  }

  // Handle union (treated as UnionModel)
  if (simpleType.union?.memberTypes) {
    const unionModels: MetaModel[] = [];
    for (const memberType of simpleType.union.memberTypes) {
      const mappedType = XSD_TYPE_MAPPING[memberType];
      if (mappedType) {
        unionModels.push(
          createPrimitiveModel(name, mappedType, {}, xsdSchema.originalInput)
        );
      }
    }
    if (unionModels.length > 0) {
      return new UnionModel(name, xsdSchema.originalInput, {}, unionModels);
    }
  }

  // Handle list (treated as array)
  if (simpleType.list?.itemType) {
    const itemType = simpleType.list.itemType;
    const mappedType = XSD_TYPE_MAPPING[itemType] || 'string';
    const itemModel = createPrimitiveModel(
      'item',
      mappedType,
      {},
      xsdSchema.originalInput
    );
    return new ArrayModel(name, xsdSchema.originalInput, {}, itemModel);
  }

  // Default to string
  return new StringModel(name, xsdSchema.originalInput, {});
}

/**
 * Resolve element type to MetaModel
 */
function resolveElementType(
  element: XsdElement,
  name: string,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>
): MetaModel {
  // Check if element has a type reference
  if (element.type) {
    const mappedType = XSD_TYPE_MAPPING[element.type];
    if (mappedType) {
      return createPrimitiveModel(
        name,
        mappedType,
        {},
        xsdSchema.originalInput
      );
    }

    const customType = typeRegistry.get(element.type);
    return customType || new StringModel(name, xsdSchema.originalInput, {});
  }

  // Check if element has inline complex type
  if (element.complexType) {
    return complexTypeToMetaModel(
      element.complexType,
      xsdSchema,
      typeRegistry,
      name
    );
  }

  // Check if element has inline simple type
  if (element.simpleType) {
    return simpleTypeToMetaModel(
      element.simpleType,
      xsdSchema,
      typeRegistry,
      name
    );
  }

  // Default to string
  return new StringModel(name, xsdSchema.originalInput, {});
}

/**
 * Convert XSD element to ObjectPropertyModel
 */
function elementToPropertyModel(
  element: XsdElement,
  xsdSchema: XsdSchema,
  typeRegistry: Map<string, MetaModel>
): ObjectPropertyModel | undefined {
  const name = element.name || 'anonymousProperty';
  const isRequired = element.minOccurs !== '0' && element.minOccurs !== 0;
  const isArray =
    element.maxOccurs === 'unbounded' ||
    (typeof element.maxOccurs === 'number' && element.maxOccurs > 1);

  let propertyMetaModel = resolveElementType(
    element,
    name,
    xsdSchema,
    typeRegistry
  );

  // Wrap in array if needed
  if (isArray) {
    propertyMetaModel = new ArrayModel(
      name,
      xsdSchema.originalInput,
      {},
      propertyMetaModel
    );
  }

  return new ObjectPropertyModel(name, isRequired, propertyMetaModel);
}

/**
 * Convert XSD attribute to ObjectPropertyModel
 */
function attributeToPropertyModel(
  attribute: any,
  xsdSchema: XsdSchema
): ObjectPropertyModel | undefined {
  const name = attribute.name || 'anonymousAttribute';
  const isRequired = attribute.use === 'required';

  let propertyMetaModel: MetaModel;

  // Attributes are typically simple types
  if (attribute.type) {
    const mappedType = XSD_TYPE_MAPPING[attribute.type] || 'string';
    propertyMetaModel = createPrimitiveModel(
      name,
      mappedType,
      {},
      xsdSchema.originalInput
    );
  } else {
    propertyMetaModel = new StringModel(name, xsdSchema.originalInput, {});
  }

  return new ObjectPropertyModel(name, isRequired, propertyMetaModel);
}

/**
 * Convert XSD xs:any to ObjectPropertyModel
 * xs:any allows any element from any namespace, so we map it to AnyModel
 */
function anyToPropertyModel(
  anyElement: any,
  index: number
): ObjectPropertyModel | undefined {
  // Generate a default property name for xs:any since it doesn't have a name attribute
  const name = `additionalProperty${index > 0 ? index : ''}`;

  // Check if the any element is required and if it's an array
  const isRequired = anyElement.minOccurs !== '0' && anyElement.minOccurs !== 0;
  const isArray =
    anyElement.maxOccurs === 'unbounded' ||
    (typeof anyElement.maxOccurs === 'number' && anyElement.maxOccurs > 1);

  // Create AnyModel to represent xs:any
  let propertyMetaModel: MetaModel = new AnyModel(name, undefined, {});

  // Wrap in array if needed
  if (isArray) {
    propertyMetaModel = new ArrayModel(name, undefined, {}, propertyMetaModel);
  }

  return new ObjectPropertyModel(name, isRequired, propertyMetaModel);
}

/**
 * Create a primitive MetaModel based on type
 */
function createPrimitiveModel(
  name: string,
  type: string,
  options: MetaModelOptions,
  originalInput: any
): MetaModel {
  switch (type) {
    case 'string':
      return new StringModel(name, originalInput, options);
    case 'integer':
      return new IntegerModel(name, originalInput, options);
    case 'float':
      return new FloatModel(name, originalInput, options);
    case 'boolean':
      return new BooleanModel(name, originalInput, options);
    default:
      return new StringModel(name, originalInput, options);
  }
}
