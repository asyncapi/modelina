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
  // XSD node name constants to avoid duplicate strings
  private static readonly XS_ELEMENT = 'xs:element';
  private static readonly XS_COMPLEX_TYPE = 'xs:complexType';
  private static readonly XS_SIMPLE_TYPE = 'xs:simpleType';
  private static readonly XS_SEQUENCE = 'xs:sequence';
  private static readonly XS_CHOICE = 'xs:choice';
  private static readonly XS_ATTRIBUTE = 'xs:attribute';
  private static readonly XS_EXTENSION = 'xs:extension';
  private static readonly XS_RESTRICTION = 'xs:restriction';
  private static readonly XS_ENUMERATION = 'xs:enumeration';
  private static readonly XS_PATTERN = 'xs:pattern';
  private static readonly XS_MIN_LENGTH = 'xs:minLength';
  private static readonly XS_MAX_LENGTH = 'xs:maxLength';
  private static readonly XS_MIN_INCLUSIVE = 'xs:minInclusive';
  private static readonly XS_MAX_INCLUSIVE = 'xs:maxInclusive';
  private static readonly XS_ANY = 'xs:any';
  private static readonly XS_COMPLEX_CONTENT = 'xs:complexContent';
  private static readonly XS_SIMPLE_CONTENT = 'xs:simpleContent';
  private static readonly ATTR_VALUE = '@_value';
  private static readonly ATTR_NAME = '@_name';
  private static readonly ATTR_TYPE = '@_type';
  private static readonly ATTR_MIN_OCCURS = '@_minOccurs';
  private static readonly ATTR_MAX_OCCURS = '@_maxOccurs';
  private static readonly ATTR_BASE = '@_base';

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
      schema.targetNamespace =
        schemaNode['@_targetNamespace'] || schemaNode.targetNamespace;
      schema.elementFormDefault =
        schemaNode['@_elementFormDefault'] || schemaNode.elementFormDefault;
      schema.attributeFormDefault =
        schemaNode['@_attributeFormDefault'] || schemaNode.attributeFormDefault;

      // Parse root elements
      schema.elements = XsdSchema.parseElements(
        schemaNode[XsdSchema.XS_ELEMENT] || schemaNode.element
      );

      // Parse complex types
      schema.complexTypes = XsdSchema.parseComplexTypes(
        schemaNode[XsdSchema.XS_COMPLEX_TYPE] || schemaNode.complexType
      );

      // Parse simple types
      schema.simpleTypes = XsdSchema.parseSimpleTypes(
        schemaNode[XsdSchema.XS_SIMPLE_TYPE] || schemaNode.simpleType
      );
    }

    return schema;
  }

  private static parseElements(elementsNode: any): XsdElement[] | undefined {
    if (!elementsNode) {
      return undefined;
    }

    const elements = Array.isArray(elementsNode)
      ? elementsNode
      : [elementsNode];
    return elements.map((elem: any) => XsdSchema.parseElement(elem));
  }

  private static parseElement(elementNode: any): XsdElement {
    const element: XsdElement = {
      name: elementNode[XsdSchema.ATTR_NAME] || elementNode.name,
      type: elementNode[XsdSchema.ATTR_TYPE] || elementNode.type,
      minOccurs:
        elementNode[XsdSchema.ATTR_MIN_OCCURS] || elementNode.minOccurs,
      maxOccurs:
        elementNode[XsdSchema.ATTR_MAX_OCCURS] || elementNode.maxOccurs,
      ref: elementNode['@_ref'] || elementNode.ref
    };

    // Parse inline complex type
    if (elementNode[XsdSchema.XS_COMPLEX_TYPE] || elementNode.complexType) {
      element.complexType = XsdSchema.parseComplexType(
        elementNode[XsdSchema.XS_COMPLEX_TYPE] || elementNode.complexType
      );
    }

    // Parse inline simple type
    if (elementNode[XsdSchema.XS_SIMPLE_TYPE] || elementNode.simpleType) {
      element.simpleType = XsdSchema.parseSimpleType(
        elementNode[XsdSchema.XS_SIMPLE_TYPE] || elementNode.simpleType
      );
    }

    return element;
  }

  private static parseComplexTypes(
    complexTypesNode: any
  ): XsdComplexType[] | undefined {
    if (!complexTypesNode) {
      return undefined;
    }

    const complexTypes = Array.isArray(complexTypesNode)
      ? complexTypesNode
      : [complexTypesNode];
    return complexTypes.map((ct: any) => XsdSchema.parseComplexType(ct));
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static parseComplexType(complexTypeNode: any): XsdComplexType {
    const complexType: XsdComplexType = {
      name: complexTypeNode['@_name'] || complexTypeNode.name
    };

    // Parse sequence
    if (complexTypeNode[XsdSchema.XS_SEQUENCE] || complexTypeNode.sequence) {
      const sequenceNode =
        complexTypeNode[XsdSchema.XS_SEQUENCE] || complexTypeNode.sequence;
      complexType.sequence = {
        elements: XsdSchema.parseElements(
          sequenceNode[XsdSchema.XS_ELEMENT] || sequenceNode.element
        ),
        any: XsdSchema.parseAny(
          sequenceNode[XsdSchema.XS_ANY] || sequenceNode.any
        )
      };
    }

    // Parse choice
    if (complexTypeNode[XsdSchema.XS_CHOICE] || complexTypeNode.choice) {
      const choiceNode =
        complexTypeNode[XsdSchema.XS_CHOICE] || complexTypeNode.choice;
      complexType.choice = {
        elements: XsdSchema.parseElements(
          choiceNode[XsdSchema.XS_ELEMENT] || choiceNode.element
        ),
        any: XsdSchema.parseAny(choiceNode[XsdSchema.XS_ANY] || choiceNode.any)
      };
    }

    // Parse attributes
    if (complexTypeNode[XsdSchema.XS_ATTRIBUTE] || complexTypeNode.attribute) {
      complexType.attributes = XsdSchema.parseAttributes(
        complexTypeNode[XsdSchema.XS_ATTRIBUTE] || complexTypeNode.attribute
      );
    }

    // Parse complexContent
    if (
      complexTypeNode[XsdSchema.XS_COMPLEX_CONTENT] ||
      complexTypeNode.complexContent
    ) {
      complexType.complexContent = XsdSchema.parseComplexContent(
        complexTypeNode[XsdSchema.XS_COMPLEX_CONTENT] ||
          complexTypeNode.complexContent
      );
    }

    // Parse simpleContent
    if (
      complexTypeNode[XsdSchema.XS_SIMPLE_CONTENT] ||
      complexTypeNode.simpleContent
    ) {
      complexType.simpleContent = XsdSchema.parseSimpleContent(
        complexTypeNode[XsdSchema.XS_SIMPLE_CONTENT] ||
          complexTypeNode.simpleContent
      );
    }

    return complexType;
  }

  private static parseSimpleTypes(
    simpleTypesNode: any
  ): XsdSimpleType[] | undefined {
    if (!simpleTypesNode) {
      return undefined;
    }

    const simpleTypes = Array.isArray(simpleTypesNode)
      ? simpleTypesNode
      : [simpleTypesNode];
    return simpleTypes.map((st: any) => XsdSchema.parseSimpleType(st));
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static parseSimpleType(simpleTypeNode: any): XsdSimpleType {
    const simpleType: XsdSimpleType = {
      name: simpleTypeNode['@_name'] || simpleTypeNode.name
    };

    // Parse restriction
    if (
      simpleTypeNode[XsdSchema.XS_RESTRICTION] ||
      simpleTypeNode.restriction
    ) {
      const restrictionNode =
        simpleTypeNode[XsdSchema.XS_RESTRICTION] || simpleTypeNode.restriction;
      simpleType.restriction = {
        base: restrictionNode[XsdSchema.ATTR_BASE] || restrictionNode.base
      };

      // Parse enumeration
      if (
        restrictionNode[XsdSchema.XS_ENUMERATION] ||
        restrictionNode.enumeration
      ) {
        const enumNodes = Array.isArray(
          restrictionNode[XsdSchema.XS_ENUMERATION] ||
            restrictionNode.enumeration
        )
          ? restrictionNode[XsdSchema.XS_ENUMERATION] ||
            restrictionNode.enumeration
          : [
              restrictionNode[XsdSchema.XS_ENUMERATION] ||
                restrictionNode.enumeration
            ];
        simpleType.restriction.enumeration = enumNodes.map(
          (e: any) => e[XsdSchema.ATTR_VALUE] || e.value
        );
      }

      // Parse pattern
      if (restrictionNode[XsdSchema.XS_PATTERN] || restrictionNode.pattern) {
        const patternNode =
          restrictionNode[XsdSchema.XS_PATTERN] || restrictionNode.pattern;
        simpleType.restriction.pattern =
          patternNode[XsdSchema.ATTR_VALUE] || patternNode.value;
      }

      // Parse length constraints
      if (
        restrictionNode[XsdSchema.XS_MIN_LENGTH] ||
        restrictionNode.minLength
      ) {
        const minLengthNode =
          restrictionNode[XsdSchema.XS_MIN_LENGTH] || restrictionNode.minLength;
        simpleType.restriction.minLength = Number.parseInt(
          minLengthNode[XsdSchema.ATTR_VALUE] || minLengthNode.value,
          10
        );
      }
      if (
        restrictionNode[XsdSchema.XS_MAX_LENGTH] ||
        restrictionNode.maxLength
      ) {
        const maxLengthNode =
          restrictionNode[XsdSchema.XS_MAX_LENGTH] || restrictionNode.maxLength;
        simpleType.restriction.maxLength = Number.parseInt(
          maxLengthNode[XsdSchema.ATTR_VALUE] || maxLengthNode.value,
          10
        );
      }

      // Parse numeric constraints
      if (
        restrictionNode[XsdSchema.XS_MIN_INCLUSIVE] ||
        restrictionNode.minInclusive
      ) {
        const minInclusiveNode =
          restrictionNode[XsdSchema.XS_MIN_INCLUSIVE] ||
          restrictionNode.minInclusive;
        simpleType.restriction.minInclusive = Number.parseFloat(
          minInclusiveNode[XsdSchema.ATTR_VALUE] || minInclusiveNode.value
        );
      }
      if (
        restrictionNode[XsdSchema.XS_MAX_INCLUSIVE] ||
        restrictionNode.maxInclusive
      ) {
        const maxInclusiveNode =
          restrictionNode[XsdSchema.XS_MAX_INCLUSIVE] ||
          restrictionNode.maxInclusive;
        simpleType.restriction.maxInclusive = Number.parseFloat(
          maxInclusiveNode[XsdSchema.ATTR_VALUE] || maxInclusiveNode.value
        );
      }
    }

    return simpleType;
  }

  private static parseAttributes(
    attributesNode: any
  ): XsdAttribute[] | undefined {
    if (!attributesNode) {
      return undefined;
    }

    const attributes = Array.isArray(attributesNode)
      ? attributesNode
      : [attributesNode];
    return attributes.map((attr: any) => ({
      name: attr['@_name'] || attr.name,
      type: attr['@_type'] || attr.type,
      use: attr['@_use'] || attr.use,
      default: attr['@_default'] || attr.default,
      fixed: attr['@_fixed'] || attr.fixed
    }));
  }

  private static parseComplexContent(
    complexContentNode: any
  ): XsdComplexContent {
    const complexContent: XsdComplexContent = {};

    // Parse extension
    if (
      complexContentNode[XsdSchema.XS_EXTENSION] ||
      complexContentNode.extension
    ) {
      const extensionNode =
        complexContentNode[XsdSchema.XS_EXTENSION] ||
        complexContentNode.extension;
      complexContent.extension = {
        base: extensionNode[XsdSchema.ATTR_BASE] || extensionNode.base
      };

      if (extensionNode[XsdSchema.XS_SEQUENCE] || extensionNode.sequence) {
        const sequenceNode =
          extensionNode[XsdSchema.XS_SEQUENCE] || extensionNode.sequence;
        complexContent.extension.sequence = {
          elements: XsdSchema.parseElements(
            sequenceNode[XsdSchema.XS_ELEMENT] || sequenceNode.element
          )
        };
      }

      if (extensionNode[XsdSchema.XS_ATTRIBUTE] || extensionNode.attribute) {
        complexContent.extension.attributes = XsdSchema.parseAttributes(
          extensionNode[XsdSchema.XS_ATTRIBUTE] || extensionNode.attribute
        );
      }
    }

    return complexContent;
  }

  private static parseSimpleContent(simpleContentNode: any): XsdSimpleContent {
    const simpleContent: XsdSimpleContent = {};

    // Parse extension
    if (
      simpleContentNode[XsdSchema.XS_EXTENSION] ||
      simpleContentNode.extension
    ) {
      const extensionNode =
        simpleContentNode[XsdSchema.XS_EXTENSION] ||
        simpleContentNode.extension;
      simpleContent.extension = {
        base: extensionNode[XsdSchema.ATTR_BASE] || extensionNode.base
      };

      if (extensionNode[XsdSchema.XS_ATTRIBUTE] || extensionNode.attribute) {
        simpleContent.extension.attributes = XsdSchema.parseAttributes(
          extensionNode[XsdSchema.XS_ATTRIBUTE] || extensionNode.attribute
        );
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
      minOccurs: node[XsdSchema.ATTR_MIN_OCCURS] || node.minOccurs,
      maxOccurs: node[XsdSchema.ATTR_MAX_OCCURS] || node.maxOccurs,
      namespace: node['@_namespace'] || node.namespace,
      processContents: node['@_processContents'] || node.processContents
    }));
  }
}
