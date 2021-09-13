/**
 * JSON Draft 6 schema model
 */
export class Draft6Schema {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: (Draft6Schema | boolean)[];
  oneOf?: (Draft6Schema | boolean)[];
  anyOf?: (Draft6Schema | boolean)[];
  not?: Draft6Schema | boolean;
  dependencies?: { [key: string]: Draft6Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: Draft6Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft6Schema | Draft6Schema[] | boolean;
  properties?: { [key: string]: Draft6Schema | boolean; };
  additionalProperties?: Draft6Schema | boolean;
  patternProperties?: { [key: string]: Draft6Schema | boolean; };
  $ref?: string;
  required?: string[];
  additionalItems?: Draft6Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: Draft6Schema | boolean;
  const?: any;
  propertyNames?: Draft6Schema | boolean;
  examples?: any[];
}
