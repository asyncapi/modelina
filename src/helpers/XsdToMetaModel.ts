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
import { XsdSchema, XsdElement, XsdComplexType, XsdSimpleType } from '../models/XsdSchema';
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
 * Convert XSD Schema to MetaModel(s)
 * 
 * @param xsdSchema The parsed XSD schema
 * @returns Array of MetaModels representing the XSD types
 */
export function XsdToMetaModel(xsdSchema: XsdSchema): MetaModel[] {
  const metaModels: MetaModel[] = [];
  const typeRegistry: Map<string, MetaModel> = new Map();
  
  // First pass: Create models for all named complex and simple types
  if (xsdSchema.complexTypes) {
    for (const complexType of xsdSchema.complexTypes) {
      if (complexType.name) {
        const model = complexTypeToMetaModel(complexType, xsdSchema, typeRegistry);
        typeRegistry.set(complexType.name, model);
        metaModels.push(model);
      }
    }
  }
  
  if (xsdSchema.simpleTypes) {
    for (const simpleType of xsdSchema.simpleTypes) {
      if (simpleType.name) {
        const model = simpleTypeToMetaModel(simpleType, xsdSchema, typeRegistry);
        typeRegistry.set(simpleType.name, model);
        metaModels.push(model);
      }
    }
  }
  
  // Second pass: Create models for root elements
  if (xsdSchema.elements) {
    for (const element of xsdSchema.elements) {
      if (element.name) {
        const model = elementToMetaModel(element, xsdSchema, typeRegistry);
        if (model) {
          metaModels.push(model);
        }
      }
    }
  }
  
  // If no models were created, create a default one
  if (metaModels.length === 0) {
    Logger.warn('No models could be generated from XSD schema, creating default model');
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
      return createPrimitiveModel(name, mappedType, options, xsdSchema.originalInput);
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
    return complexTypeToMetaModel(element.complexType, xsdSchema, typeRegistry, name);
  }
  
  // If element has inline simple type
  if (element.simpleType) {
    return simpleTypeToMetaModel(element.simpleType, xsdSchema, typeRegistry, name);
  }
  
  // Default to string if type is not specified
  return new StringModel(name, xsdSchema.originalInput, options);
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
  
  // Process sequence elements
  if (complexType.sequence?.elements) {
    for (const element of complexType.sequence.elements) {
      if (element.name) {
        const propertyModel = elementToPropertyModel(element, xsdSchema, typeRegistry);
        if (propertyModel) {
          properties[element.name] = propertyModel;
        }
      }
    }
  }
  
  // Process xs:any in sequence
  if (complexType.sequence?.any) {
    for (let i = 0; i < complexType.sequence.any.length; i++) {
      const anyElement = complexType.sequence.any[i];
      const propertyModel = anyToPropertyModel(anyElement, i);
      if (propertyModel) {
        properties[propertyModel.propertyName] = propertyModel;
      }
    }
  }
  
  // Process choice elements (treated as optional union)
  if (complexType.choice?.elements) {
    for (const element of complexType.choice.elements) {
      if (element.name) {
        const propertyModel = elementToPropertyModel(element, xsdSchema, typeRegistry);
        if (propertyModel) {
          propertyModel.required = false; // Choice elements are optional
          properties[element.name] = propertyModel;
        }
      }
    }
  }
  
  // Process xs:any in choice
  if (complexType.choice?.any) {
    for (let i = 0; i < complexType.choice.any.length; i++) {
      const anyElement = complexType.choice.any[i];
      const propertyModel = anyToPropertyModel(anyElement, i);
      if (propertyModel) {
        propertyModel.required = false; // Choice elements are optional
        properties[propertyModel.propertyName] = propertyModel;
      }
    }
  }
  
  // Process attributes
  if (complexType.attributes) {
    for (const attribute of complexType.attributes) {
      if (attribute.name) {
        const propertyModel = attributeToPropertyModel(attribute, xsdSchema);
        if (propertyModel) {
          properties[attribute.name] = propertyModel;
        }
      }
    }
  }
  
  // Process complex content (inheritance)
  if (complexType.complexContent?.extension) {
    const extension = complexType.complexContent.extension;
    
    // Add properties from extension
    if (extension.sequence?.elements) {
      for (const element of extension.sequence.elements) {
        if (element.name) {
          const propertyModel = elementToPropertyModel(element, xsdSchema, typeRegistry);
          if (propertyModel) {
            properties[element.name] = propertyModel;
          }
        }
      }
    }
    
    if (extension.attributes) {
      for (const attribute of extension.attributes) {
        if (attribute.name) {
          const propertyModel = attributeToPropertyModel(attribute, xsdSchema);
          if (propertyModel) {
            properties[attribute.name] = propertyModel;
          }
        }
      }
    }
    
    // TODO: Handle base type extension properly (would need to add extend support)
  }
  
  // Process simple content (object with a value and attributes)
  if (complexType.simpleContent?.extension) {
    const extension = complexType.simpleContent.extension;
    
    // Add a 'value' property for the text content
    const baseType = extension.base || 'xs:string';
    const mappedType = XSD_TYPE_MAPPING[baseType] || 'string';
    const valueModel = createPrimitiveModel('value', mappedType, {}, xsdSchema.originalInput);
    properties['value'] = new ObjectPropertyModel('value', true, valueModel);
    
    // Add attributes
    if (extension.attributes) {
      for (const attribute of extension.attributes) {
        if (attribute.name) {
          const propertyModel = attributeToPropertyModel(attribute, xsdSchema);
          if (propertyModel) {
            properties[attribute.name] = propertyModel;
          }
        }
      }
    }
  }
  
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
    const enumValues = simpleType.restriction.enumeration.map((value, index) => {
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
        unionModels.push(createPrimitiveModel(name, mappedType, {}, xsdSchema.originalInput));
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
    const itemModel = createPrimitiveModel('item', mappedType, {}, xsdSchema.originalInput);
    return new ArrayModel(name, xsdSchema.originalInput, {}, itemModel);
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
  const isArray = element.maxOccurs === 'unbounded' || (typeof element.maxOccurs === 'number' && element.maxOccurs > 1);
  
  let propertyMetaModel: MetaModel;
  
  // Determine the type
  if (element.type) {
    const mappedType = XSD_TYPE_MAPPING[element.type];
    if (mappedType) {
      // Primitive type
      propertyMetaModel = createPrimitiveModel(name, mappedType, {}, xsdSchema.originalInput);
    } else {
      // Custom type reference
      const customType = typeRegistry.get(element.type);
      if (customType) {
        propertyMetaModel = customType;
      } else {
        propertyMetaModel = new StringModel(name, xsdSchema.originalInput, {});
      }
    }
  } else if (element.complexType) {
    propertyMetaModel = complexTypeToMetaModel(element.complexType, xsdSchema, typeRegistry, name);
  } else if (element.simpleType) {
    propertyMetaModel = simpleTypeToMetaModel(element.simpleType, xsdSchema, typeRegistry, name);
  } else {
    propertyMetaModel = new StringModel(name, xsdSchema.originalInput, {});
  }
  
  // Wrap in array if needed
  if (isArray) {
    propertyMetaModel = new ArrayModel(name, xsdSchema.originalInput, {}, propertyMetaModel);
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
    propertyMetaModel = createPrimitiveModel(name, mappedType, {}, xsdSchema.originalInput);
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
  const isArray = anyElement.maxOccurs === 'unbounded' || (typeof anyElement.maxOccurs === 'number' && anyElement.maxOccurs > 1);
  
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

