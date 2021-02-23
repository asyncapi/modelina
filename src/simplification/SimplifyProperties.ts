
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
type Output = Record<string, CommonModel> | undefined;

/**
 * Simplifier function for finding the simplified version of properties.
 * 
 * @param schema the schema to simplify properties for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyProperties(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()): Output {
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) return seenSchemas.get(schema);
    const output: Output = {};
    seenSchemas.set(schema, output);
  
    for (const [prop, propSchema] of Object.entries(schema.properties || {})) {
      const newModels = simplifier.simplify(propSchema);
      if (newModels.length > 0) {
        addToProperty(prop, newModels[0], schema, output);
      }
    }

    //If we encounter combination schemas ensure we recursively find the properties
    if (simplifier.options.allowInheritance !== true) {
      //Only merge allOf schemas if we don't allow inheritance
      combineSchemas(schema.allOf, output, simplifier, seenSchemas, schema);
    }
    combineSchemas(schema.oneOf, output, simplifier, seenSchemas, schema);
    combineSchemas(schema.anyOf, output, simplifier, seenSchemas, schema);

    //If we encounter combination schemas ensure we recursively find the properties
    combineSchemas(schema.then, output, simplifier, seenSchemas, schema);
    combineSchemas(schema.else, output, simplifier, seenSchemas, schema);

    return !Object.keys(output).length ? undefined : output;
  }
  return undefined;
}

/**
 * Adds a property to the model
 * 
 * @param propName name of the property
 * @param propModel the corresponding model
 * @param schema the schema for the model
 * @param currentModel the current output
 */
function addToProperty(propName: string, propModel: CommonModel, schema: Schema, currentModel: Output) {
  if (currentModel === undefined) return;
  //If a simplified property already exist, merge the two
  if (currentModel[`${propName}`] !== undefined) {
    currentModel[`${propName}`] = CommonModel.mergeCommonModels(currentModel[`${propName}`], propModel, schema);
  } else {
    currentModel[`${propName}`] = propModel;
  }
}

/**
 * Go through schema(s) and combine the simplified properties together.
 * 
 * @param schema to go through
 * @param currentModel the current output
 * @param simplifier the simplifier to use
 * @param seenSchemas schemas which we already have outputs for
 * @param rootSchema the root schema we are combining schemas for
 */
function combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: Output, simplifier : Simplifier, seenSchemas: Map<any, Output>, rootSchema : Schema) {
  if (typeof schema !== 'object') return;
  if (Array.isArray(schema)) {
    schema.forEach((combinationSchema) => {
      combineSchemas(combinationSchema, currentModel, simplifier, seenSchemas, rootSchema);
    });
  } else {
    const props = simplifyProperties(schema, simplifier, seenSchemas);
    if (props !== undefined) {
      for (const [prop, propSchema] of Object.entries(props)) {
        addToProperty(prop, propSchema, rootSchema, currentModel);
      }
    }
  }
}
