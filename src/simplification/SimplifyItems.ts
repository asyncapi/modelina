
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
    if (seenSchemas.has(schema)) return seenSchemas.get(schema);
    const tempOutput: Output = new CommonModel();
    seenSchemas.set(schema, tempOutput);

    //Check if any items have been set, if so lets merge them
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((value) => {
          mergeWithCurrentModel(simplifier.simplify(value)[0], schema, tempOutput);
        });
      } else {
        mergeWithCurrentModel(simplifier.simplify(schema.items)[0], schema, tempOutput);
      }
    }

    //If we encounter combination schemas ensure we recursively find the items
    combineSchemas(schema.allOf, tempOutput, simplifier, seenSchemas);
    combineSchemas(schema.oneOf, tempOutput, simplifier, seenSchemas);
    combineSchemas(schema.anyOf, tempOutput, simplifier, seenSchemas);

    //If we encounter conditional schemas ensure we recursively find the items
    combineSchemas(schema.then, tempOutput, simplifier, seenSchemas);
    combineSchemas(schema.else, tempOutput, simplifier, seenSchemas);
    
    return !Object.keys(tempOutput).length ? undefined : tempOutput;
  }
  return undefined;
}

/**
 * Go through schema(s) and combine the simplified items together.
 * 
 * @param schema to go through
 * @param currentModel the current output
 * @param simplifier the simplifier to use
 * @param seenSchemas schemas which we already have outputs for
 */
function combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: Output, simplifier : Simplifier, seenSchemas: Map<any, Output>) {
  if (schema === undefined) return;
  if (typeof schema === 'boolean') return;
  if (Array.isArray(schema)) {
    schema.forEach((itemSchema) => {
      combineSchemas(itemSchema, currentModel, simplifier, seenSchemas);
    });
  } else {
    const simplifiedItems = simplifyItems(schema, simplifier, seenSchemas);
    if (simplifiedItems !== undefined) {
      mergeWithCurrentModel(simplifiedItems, schema, currentModel);
    }
  }
}

/**
 * Merge common models together
 * 
 * @param model to merge from
 * @param schema 
 * @param currentModel to merge into 
 */
function mergeWithCurrentModel(model: CommonModel, schema: Schema, currentModel: Output) {
  CommonModel.mergeCommonModels(currentModel, model, schema);
}
