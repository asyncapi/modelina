import { CommonSchema, Schema } from "../models";

export enum ModelKind {
  OBJECT = "object",
  ARRAY = "array",
  PRIMITIVE = "primitive",
  ENUM = "enum",
  UNION = "union",
};

export class TypeHelpers {
  static extractKind(schema: Schema | CommonSchema<any>): ModelKind {
    if (schema.type === "object") return ModelKind.OBJECT;
    if (schema.type === "array") return ModelKind.ARRAY;
    if (Array.isArray(schema.type)) return ModelKind.UNION;
    if (Array.isArray(schema.enum)) return ModelKind.ENUM;
    return ModelKind.PRIMITIVE;
  }
}
