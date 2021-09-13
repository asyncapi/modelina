
export class OpenAPI3_0Xml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export class OpenAPI3_0ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
}
export class OpenAPI3_0Discriminator {
  propertyName?: string;
  mapping?: {[k: string]: string};
}

/**
 * OpenAPI 3.0 -> 3.0.4 schema model
 * 
 * Based on Draft 6, but with restricted keywords and definitions
 * Modifications
 *  - type, cannot be an array nor contain 'null'
 * 
 * Restrictions (keywords not allowed)
 *  - patternProperties
 *  - not
 * 
 * https://swagger.io/specification/#schema-object
 */
export class OpenAPI3_0Schema {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  //Must be according to https://www.ecma-international.org/ecma-262/5.1/#sec-15.10.1
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: (OpenAPI3_0Schema | boolean)[];
  oneOf?: (OpenAPI3_0Schema | boolean)[];
  anyOf?: (OpenAPI3_0Schema | boolean)[];
  dependencies?: { [key: string]: OpenAPI3_0Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: OpenAPI3_0Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: OpenAPI3_0Schema | OpenAPI3_0Schema[] | boolean;
  properties?: { [key: string]: OpenAPI3_0Schema | boolean; };
  additionalProperties?: OpenAPI3_0Schema | boolean;
  patternProperties?: { [key: string]: OpenAPI3_0Schema | boolean; };
  $ref?: string;
  required?: string[];
  additionalItems?: OpenAPI3_0Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: (OpenAPI3_0Schema | boolean);
  const?: any;
  propertyNames?: OpenAPI3_0Schema | boolean;
  examples?: any;

  //OpenAPI 3.0 -> 3.0.4 additions
  nullable?: boolean;
  discriminator?: OpenAPI3_0Discriminator;
  xml?: OpenAPI3_0Xml;
  readOnly?: boolean;
  writeOnly?: boolean;
  externalDocs?: OpenAPI3_0ExternalDocumentation;
  example?: any;
  deprecated?: boolean;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
}
