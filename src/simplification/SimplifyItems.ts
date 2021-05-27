
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';

type Output = CommonModel | undefined;

/**
 * Find the items for a simplified version of a schema
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyItems(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()) : Output {
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) {return seenSchemas.get(schema);}
    const output: Output = new CommonModel();
    seenSchemas.set(schema, output);

    //Check if any items have been set, if so lets merge them
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((value) => {
          mergeWithCurrentModel(simplifier.simplify(value)[0], schema, output);
        });
      } else {
        mergeWithCurrentModel(simplifier.simplify(schema.items)[0], schema, output);
      }
    }

    //If we encounter combination schemas ensure we recursively find the items
    combineSchemas(schema.allOf, output, simplifier, seenSchemas);
    combineSchemas(schema.oneOf, output, simplifier, seenSchemas);
    combineSchemas(schema.anyOf, output, simplifier, seenSchemas);

    //If we encounter conditional schemas ensure we recursively find the items
    combineSchemas(schema.then, output, simplifier, seenSchemas);
    combineSchemas(schema.else, output, simplifier, seenSchemas);
    
    return !Object.keys(output).length ? undefined : output;
  }
  return undefined;
}

/**
 * Go through schema(s) and combine the simplified items together.
 * 
 * @param schema to go through
 * @param currentOutput the current output
 * @param simplifier the simplifier to use
 * @param seenSchemas schemas which we already have outputs for
 */
function combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentOutput: Output, simplifier : Simplifier, seenSchemas: Map<any, Output>) {
  if (typeof schema !== 'object') {return;}
  if (Array.isArray(schema)) {
    schema.forEach((itemSchema) => {
      combineSchemas(itemSchema, currentOutput, simplifier, seenSchemas);
    });
  } else {
    const simplifiedItems = simplifyItems(schema, simplifier, seenSchemas);
    if (simplifiedItems !== undefined) {
      mergeWithCurrentModel(simplifiedItems, schema, currentOutput);
    }
  }
}

/**
 * Merge common models together
 * 
 * @param model to merge from
 * @param schema it is from
 * @param currentOutput to merge into 
 */
function mergeWithCurrentModel(model: CommonModel, schema: Schema, currentOutput: Output) {
  CommonModel.mergeCommonModels(currentOutput, model, schema);
}
