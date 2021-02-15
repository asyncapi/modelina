
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
type Output = { [key: string]: CommonModel } | undefined;

/**
 * Simplifier function for finding the simplified version of properties.
 * 
 * @param schema the schema to simplify properties for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyProperties(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()): Output {
  let output: Output;
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) return seenSchemas.get(schema);
    seenSchemas.set(schema, output);
    const addToProperty = (propName: string, propModel: CommonModel) => {
      if (output === undefined) {
        output = {};
      }
      //If a simplified property already exist, merge the two
      if (output[`${propName}`] !== undefined) {
        output[`${propName}`] = CommonModel.mergeCommonModels(output[`${propName}`], propModel, schema);
      } else {
        output[`${propName}`] = propModel;
      }
    };
    const addProperties = (out: Output) => {
      if (out !== undefined) {
        for (const [prop, propSchema] of Object.entries(out)) {
          addToProperty(prop, propSchema);
        }
      }
    };
    const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
      schemas.forEach((schema) => {
        addProperties(simplifyProperties(schema, simplifier, seenSchemas));
      });
    };

    if (schema.properties !== undefined) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        const newModels = simplifier.simplify(propSchema);
        if (newModels.length > 0) {
          addToProperty(prop, newModels[0]);
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
      addProperties(simplifyProperties(schema.then, simplifier, seenSchemas));
    }
    if (schema.else) {
      addProperties(simplifyProperties(schema.else, simplifier, seenSchemas));
    }
  }
  return output;
}