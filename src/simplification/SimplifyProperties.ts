
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import { Simplifier } from "./Simplifier";
type Output = { newModels: CommonModel[] | undefined; properties: { [key: string]: CommonModel } | undefined };

/**
 * Simplifier function for finding the simplified version of properties.
 * 
 * @param schema the schema to simplify properties for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyProperties(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()): Output{
  let output: Output = {newModels: undefined, properties: undefined};
  if (typeof schema !== "boolean") {
    if (seenSchemas.has(schema)) return seenSchemas.get(schema)!;
    seenSchemas.set(schema, output);
    const addToModels = (model: CommonModel[] = []) => { output.newModels = [...(output.newModels || []), ...model]; }
    const addToProperty = (propName: string, propModel: CommonModel) => {
      if (output.properties === undefined) {
        output.properties = {};
      }
      //If a simplified property already exist, merge the two
      if (output.properties[propName] !== undefined) {
        output.properties[propName] = CommonModel.mergeCommonModels(output.properties[propName], propModel, schema);
      } else {
        output.properties[propName] = propModel;
      }
    }
    const addToPropertiesAndModels = (out: Output) => {
      if (out?.newModels !== undefined) {
        addToModels(out.newModels);
      }
      if (out.properties !== undefined) {
        for (const [prop, propSchema] of Object.entries(out.properties)) {
          addToProperty(prop, propSchema);
        }
      }
    };
    const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
      schemas.forEach((schema) => {
        addToPropertiesAndModels(simplifyProperties(schema, simplifier, seenSchemas));
      });
    }

    if (schema.properties !== undefined) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        let newModels = simplifier.simplifyRecursive(propSchema);
        addToProperty(prop, newModels[0]);
        //If there are more then one model returned, it is extra.
        if (newModels.length > 1) {
          newModels.splice(0, 1);
          addToModels(newModels);
        }
      }
    }
    //If we encounter combination schemas ensure we recursively find the properties
    if (simplifier.options.allowInheritance !== true) {
      //Only merge allOf schemas if we don't allow inheritance
      handleCombinationSchemas(schema.allOf);
    }
    handleCombinationSchemas(schema.oneOf);
    handleCombinationSchemas(schema.anyOf);

    //If we encounter combination schemas ensure we recursively find the properties
    if (schema.then) {
      addToPropertiesAndModels(simplifyProperties(schema.then, simplifier, seenSchemas));
    }
    if (schema.else) {
      addToPropertiesAndModels(simplifyProperties(schema.else, simplifier, seenSchemas));
    }
  }
  return output;
};