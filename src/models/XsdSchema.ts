/**
 * XSD Schema model representing XML Schema Definition elements
 */

export interface XsdAttribute {
  name?: string;
  type?: string;
  use?: 'required' | 'optional' | 'prohibited';
  default?: string;
  fixed?: string;
}

export interface XsdElement {
  name?: string;
  type?: string;
  minOccurs?: string | number;
  maxOccurs?: string | number;
  ref?: string;
  complexType?: XsdComplexType;
  simpleType?: XsdSimpleType;
}

export interface XsdSequence {
  elements?: XsdElement[];
  any?: XsdAny[];
}

export interface XsdChoice {
  elements?: XsdElement[];
  any?: XsdAny[];
}

export interface XsdAny {
  minOccurs?: string | number;
  maxOccurs?: string | number;
  namespace?: string;
  processContents?: string;
}

export interface XsdComplexContent {
  extension?: {
    base?: string;
    sequence?: XsdSequence;
    choice?: XsdChoice;
    attributes?: XsdAttribute[];
  };
  restriction?: {
    base?: string;
    sequence?: XsdSequence;
    choice?: XsdChoice;
    attributes?: XsdAttribute[];
  };
}

export interface XsdSimpleContent {
  extension?: {
    base?: string;
    attributes?: XsdAttribute[];
  };
  restriction?: {
    base?: string;
    attributes?: XsdAttribute[];
    enumeration?: string[];
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minInclusive?: number;
    maxInclusive?: number;
  };
}

export interface XsdComplexType {
  name?: string;
  sequence?: XsdSequence;
  choice?: XsdChoice;
  attributes?: XsdAttribute[];
  complexContent?: XsdComplexContent;
  simpleContent?: XsdSimpleContent;
}

export interface XsdSimpleType {
  name?: string;
  restriction?: {
    base?: string;
    enumeration?: string[];
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minInclusive?: number;
    maxInclusive?: number;
  };
  union?: {
    memberTypes?: string[];
  };
  list?: {
    itemType?: string;
  };
}

export class XsdSchema {
  targetNamespace?: string;
  elementFormDefault?: string;
  attributeFormDefault?: string;
  elements?: XsdElement[];
  complexTypes?: XsdComplexType[];
  simpleTypes?: XsdSimpleType[];
  originalInput?: any;

  /**
   * Convert raw parsed XSD object to XsdSchema
   */
  static toSchema(object: any): XsdSchema {
    const schema = new XsdSchema();
    schema.originalInput = object;
    
    // Extract schema attributes
    if (object['xs:schema'] || object.schema) {
      const schemaNode = object['xs:schema'] || object.schema;
      schema.targetNamespace = schemaNode['@_targetNamespace'] || schemaNode.targetNamespace;
      schema.elementFormDefault = schemaNode['@_elementFormDefault'] || schemaNode.elementFormDefault;
      schema.attributeFormDefault = schemaNode['@_attributeFormDefault'] || schemaNode.attributeFormDefault;
      
      // Parse root elements
      schema.elements = XsdSchema.parseElements(schemaNode['xs:element'] || schemaNode.element);
      
      // Parse complex types
      schema.complexTypes = XsdSchema.parseComplexTypes(schemaNode['xs:complexType'] || schemaNode.complexType);
      
      // Parse simple types
      schema.simpleTypes = XsdSchema.parseSimpleTypes(schemaNode['xs:simpleType'] || schemaNode.simpleType);
    }
    
    return schema;
  }

  private static parseElements(elementsNode: any): XsdElement[] | undefined {
    if (!elementsNode) {
      return undefined;
    }
    
    const elements = Array.isArray(elementsNode) ? elementsNode : [elementsNode];
    return elements.map((elem: any) => XsdSchema.parseElement(elem));
  }

  private static parseElement(elementNode: any): XsdElement {
    const element: XsdElement = {
      name: elementNode['@_name'] || elementNode.name,
      type: elementNode['@_type'] || elementNode.type,
      minOccurs: elementNode['@_minOccurs'] || elementNode.minOccurs,
      maxOccurs: elementNode['@_maxOccurs'] || elementNode.maxOccurs,
      ref: elementNode['@_ref'] || elementNode.ref
    };
    
    // Parse inline complex type
    if (elementNode['xs:complexType'] || elementNode.complexType) {
      element.complexType = XsdSchema.parseComplexType(elementNode['xs:complexType'] || elementNode.complexType);
    }
    
    // Parse inline simple type
    if (elementNode['xs:simpleType'] || elementNode.simpleType) {
      element.simpleType = XsdSchema.parseSimpleType(elementNode['xs:simpleType'] || elementNode.simpleType);
    }
    
    return element;
  }

  private static parseComplexTypes(complexTypesNode: any): XsdComplexType[] | undefined {
    if (!complexTypesNode) {
      return undefined;
    }
    
    const complexTypes = Array.isArray(complexTypesNode) ? complexTypesNode : [complexTypesNode];
    return complexTypes.map((ct: any) => XsdSchema.parseComplexType(ct));
  }

  private static parseComplexType(complexTypeNode: any): XsdComplexType {
    const complexType: XsdComplexType = {
      name: complexTypeNode['@_name'] || complexTypeNode.name
    };
    
    // Parse sequence
    if (complexTypeNode['xs:sequence'] || complexTypeNode.sequence) {
      const sequenceNode = complexTypeNode['xs:sequence'] || complexTypeNode.sequence;
      complexType.sequence = {
        elements: XsdSchema.parseElements(sequenceNode['xs:element'] || sequenceNode.element),
        any: XsdSchema.parseAny(sequenceNode['xs:any'] || sequenceNode.any)
      };
    }
    
    // Parse choice
    if (complexTypeNode['xs:choice'] || complexTypeNode.choice) {
      const choiceNode = complexTypeNode['xs:choice'] || complexTypeNode.choice;
      complexType.choice = {
        elements: XsdSchema.parseElements(choiceNode['xs:element'] || choiceNode.element),
        any: XsdSchema.parseAny(choiceNode['xs:any'] || choiceNode.any)
      };
    }
    
    // Parse attributes
    if (complexTypeNode['xs:attribute'] || complexTypeNode.attribute) {
      complexType.attributes = XsdSchema.parseAttributes(complexTypeNode['xs:attribute'] || complexTypeNode.attribute);
    }
    
    // Parse complexContent
    if (complexTypeNode['xs:complexContent'] || complexTypeNode.complexContent) {
      complexType.complexContent = XsdSchema.parseComplexContent(complexTypeNode['xs:complexContent'] || complexTypeNode.complexContent);
    }
    
    // Parse simpleContent
    if (complexTypeNode['xs:simpleContent'] || complexTypeNode.simpleContent) {
      complexType.simpleContent = XsdSchema.parseSimpleContent(complexTypeNode['xs:simpleContent'] || complexTypeNode.simpleContent);
    }
    
    return complexType;
  }

  private static parseSimpleTypes(simpleTypesNode: any): XsdSimpleType[] | undefined {
    if (!simpleTypesNode) {
      return undefined;
    }
    
    const simpleTypes = Array.isArray(simpleTypesNode) ? simpleTypesNode : [simpleTypesNode];
    return simpleTypes.map((st: any) => XsdSchema.parseSimpleType(st));
  }

  private static parseSimpleType(simpleTypeNode: any): XsdSimpleType {
    const simpleType: XsdSimpleType = {
      name: simpleTypeNode['@_name'] || simpleTypeNode.name
    };
    
    // Parse restriction
    if (simpleTypeNode['xs:restriction'] || simpleTypeNode.restriction) {
      const restrictionNode = simpleTypeNode['xs:restriction'] || simpleTypeNode.restriction;
      simpleType.restriction = {
        base: restrictionNode['@_base'] || restrictionNode.base
      };
      
      // Parse enumeration
      if (restrictionNode['xs:enumeration'] || restrictionNode.enumeration) {
        const enumNodes = Array.isArray(restrictionNode['xs:enumeration'] || restrictionNode.enumeration) 
          ? (restrictionNode['xs:enumeration'] || restrictionNode.enumeration)
          : [restrictionNode['xs:enumeration'] || restrictionNode.enumeration];
        simpleType.restriction.enumeration = enumNodes.map((e: any) => e['@_value'] || e.value);
      }
      
      // Parse pattern
      if (restrictionNode['xs:pattern'] || restrictionNode.pattern) {
        const patternNode = restrictionNode['xs:pattern'] || restrictionNode.pattern;
        simpleType.restriction.pattern = patternNode['@_value'] || patternNode.value;
      }
      
      // Parse length constraints
      if (restrictionNode['xs:minLength'] || restrictionNode.minLength) {
        const minLengthNode = restrictionNode['xs:minLength'] || restrictionNode.minLength;
        simpleType.restriction.minLength = parseInt(minLengthNode['@_value'] || minLengthNode.value);
      }
      if (restrictionNode['xs:maxLength'] || restrictionNode.maxLength) {
        const maxLengthNode = restrictionNode['xs:maxLength'] || restrictionNode.maxLength;
        simpleType.restriction.maxLength = parseInt(maxLengthNode['@_value'] || maxLengthNode.value);
      }
      
      // Parse numeric constraints
      if (restrictionNode['xs:minInclusive'] || restrictionNode.minInclusive) {
        const minInclusiveNode = restrictionNode['xs:minInclusive'] || restrictionNode.minInclusive;
        simpleType.restriction.minInclusive = parseFloat(minInclusiveNode['@_value'] || minInclusiveNode.value);
      }
      if (restrictionNode['xs:maxInclusive'] || restrictionNode.maxInclusive) {
        const maxInclusiveNode = restrictionNode['xs:maxInclusive'] || restrictionNode.maxInclusive;
        simpleType.restriction.maxInclusive = parseFloat(maxInclusiveNode['@_value'] || maxInclusiveNode.value);
      }
    }
    
    return simpleType;
  }

  private static parseAttributes(attributesNode: any): XsdAttribute[] | undefined {
    if (!attributesNode) {
      return undefined;
    }
    
    const attributes = Array.isArray(attributesNode) ? attributesNode : [attributesNode];
    return attributes.map((attr: any) => ({
      name: attr['@_name'] || attr.name,
      type: attr['@_type'] || attr.type,
      use: attr['@_use'] || attr.use,
      default: attr['@_default'] || attr.default,
      fixed: attr['@_fixed'] || attr.fixed
    }));
  }

  private static parseComplexContent(complexContentNode: any): XsdComplexContent {
    const complexContent: XsdComplexContent = {};
    
    // Parse extension
    if (complexContentNode['xs:extension'] || complexContentNode.extension) {
      const extensionNode = complexContentNode['xs:extension'] || complexContentNode.extension;
      complexContent.extension = {
        base: extensionNode['@_base'] || extensionNode.base
      };
      
      if (extensionNode['xs:sequence'] || extensionNode.sequence) {
        const sequenceNode = extensionNode['xs:sequence'] || extensionNode.sequence;
        complexContent.extension.sequence = {
          elements: XsdSchema.parseElements(sequenceNode['xs:element'] || sequenceNode.element)
        };
      }
      
      if (extensionNode['xs:attribute'] || extensionNode.attribute) {
        complexContent.extension.attributes = XsdSchema.parseAttributes(extensionNode['xs:attribute'] || extensionNode.attribute);
      }
    }
    
    return complexContent;
  }

  private static parseSimpleContent(simpleContentNode: any): XsdSimpleContent {
    const simpleContent: XsdSimpleContent = {};
    
    // Parse extension
    if (simpleContentNode['xs:extension'] || simpleContentNode.extension) {
      const extensionNode = simpleContentNode['xs:extension'] || simpleContentNode.extension;
      simpleContent.extension = {
        base: extensionNode['@_base'] || extensionNode.base
      };
      
      if (extensionNode['xs:attribute'] || extensionNode.attribute) {
        simpleContent.extension.attributes = XsdSchema.parseAttributes(extensionNode['xs:attribute'] || extensionNode.attribute);
      }
    }
    
    return simpleContent;
  }

  private static parseAny(anyNode: any): XsdAny[] | undefined {
    if (!anyNode) {
      return undefined;
    }
    
    const anyNodes = Array.isArray(anyNode) ? anyNode : [anyNode];
    return anyNodes.map((node: any) => ({
      minOccurs: node['@_minOccurs'] || node.minOccurs,
      maxOccurs: node['@_maxOccurs'] || node.maxOccurs,
      namespace: node['@_namespace'] || node.namespace,
      processContents: node['@_processContents'] || node.processContents
    }));
  }
}

