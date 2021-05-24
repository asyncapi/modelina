import { CommonModel } from '../models';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
type Output = Record<string, CommonModel> | undefined;

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyPatternProperties(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()) : Output {
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) return seenSchemas.get(schema);
    const output: Output = {};
    seenSchemas.set(schema, output);
  
    for (const [pattern, patternSchema] of Object.entries(schema.patternProperties || {})) {
      const newModels = simplifier.simplify(patternSchema);
      if (newModels.length > 0) {
        addToPatterns(pattern, newModels[0], schema, output);
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

    return Object.keys(output).length ? output : undefined;
  }
  return undefined;
}
/**
 * Adds a pattern to the model
 * 
 * @param pattern for the model
 * @param patternModel the corresponding model for the pattern
 * @param schema for the model
 * @param currentModel the current output
 */
function addToPatterns(pattern: string, patternModel: CommonModel, schema: Schema, currentModel: Output) {
  if (currentModel === undefined) return;
  //If the pattern already exist, merge the two
  if (currentModel[String(pattern)] !== undefined) {
    currentModel[String(pattern)] = CommonModel.mergeCommonModels(currentModel[String(pattern)], patternModel, schema);
  } else {
    currentModel[String(pattern)] = patternModel;
  }
}
/**
 * Go through schema(s) and combine the simplified properties together.
 * 
 * @param schema to go through
 * @param currentModel the current output
 * @param simplifier to use
 * @param seenSchemas which we already have outputs for
 * @param rootSchema we are combining schemas for
 */
function combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: Output, simplifier : Simplifier, seenSchemas: Map<any, Output>, rootSchema : Schema) {
  if (typeof schema !== 'object') return;
  if (Array.isArray(schema)) {
    schema.forEach((combinationSchema) => {
      combineSchemas(combinationSchema, currentModel, simplifier, seenSchemas, rootSchema);
    });
  } else {
    const patternProperties = simplifyPatternProperties(schema, simplifier, seenSchemas);
    if (patternProperties !== undefined) {
      for (const [pattern, patternSchema] of Object.entries(patternProperties)) {
        addToPatterns(pattern, patternSchema, rootSchema, currentModel);
      }
    }
  }
}
