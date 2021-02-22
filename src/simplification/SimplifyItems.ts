
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
  let tempOutput: Output;
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) return seenSchemas.get(schema)!;
    seenSchemas.set(schema, tempOutput);
    const mergeWithItem = (model : CommonModel) => {
      tempOutput = CommonModel.mergeCommonModels(tempOutput, model, schema);
    };
    const addToItems = (out: Output) => {
      if (out !== undefined) {
        mergeWithItem(out);
      }
    };
    const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
      schemas.forEach((itemSchema) => {
        addToItems(simplifyItems(itemSchema, simplifier, seenSchemas));
      });
    };

    if (schema.items !== undefined) {
      const addItemsAndModels = (newModels : CommonModel[]) => {
        mergeWithItem(newModels[0]);
      };
      if (Array.isArray(schema.items)) {
        schema.items.forEach((value) => {
          addItemsAndModels(simplifier.simplify(value));
        });
      } else {
        addItemsAndModels(simplifier.simplify(schema.items));
      }
    }

    //If we encounter combination schemas ensure we recursively find the properties
    handleCombinationSchemas(schema.allOf);
    handleCombinationSchemas(schema.oneOf);
    handleCombinationSchemas(schema.anyOf);

    //If we encounter combination schemas ensure we recursively find the properties
    if (schema.then) {
      addToItems(simplifyItems(schema.then, simplifier, seenSchemas));
    }
    if (schema.else) {
      addToItems(simplifyItems(schema.else, simplifier, seenSchemas));
    }
  }
    
  return tempOutput;
}