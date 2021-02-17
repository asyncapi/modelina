import { FormatHelpers } from "../helpers";
import { Schema } from "../models";

export function applySchemaExtension(schema: Schema | boolean, key: string, value: string): void {
  if (typeof schema !== "boolean" && schema.constructor && schema.constructor.name === "Schema") {
    key = `x-modelgen-${FormatHelpers.toParamCase(key)}`;
    schema[key] = value;
  }
}
