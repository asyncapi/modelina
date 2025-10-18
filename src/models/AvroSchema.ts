/**
 * Avro Schema model
 */

export class AvroSchema {
  type?: string | string[] | AvroSchema;
  name?: string;
  namespace?: string;
  originalInput?: any;
  doc?: string;
  aliases?: string[];
  symbols?: string[];
  items?: string;
  fields?: AvroSchema[];
  example?: string | number;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  default?: unknown;
  exclusiveMinimum?: unknown;
  exclusiveMaximum?: unknown;
  logicalType?: unknown;
  values?: string;
}
