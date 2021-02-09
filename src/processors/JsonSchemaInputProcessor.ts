import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel'
import Simplifier from '../simplification/Simplifier';
import { Schema } from '../models/Schema';
import $RefParser, { SchemaCallback } from '@apidevtools/json-schema-ref-parser';
import path from 'path';
import { ParsedSchema } from '../models/ParsedSchema';
import { SchemaIteratorCallbackType, traverseSchema, TraverseSchemaCallback } from '../helpers/Iterators';
/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {

  /**
   * Function for processing a JSON Schema input.
   * 
   * @param input 
   */
  async process(input: any): Promise<CommonInputModel> {
    if (this.shouldProcess(input)) {
      if (input.$schema !== undefined) {
        switch (input.$schema) {
          case 'http://json-schema.org/draft-07/schema#':
            return this.processDraft7(input);
        }
      } else {
        return this.processDraft7(input);
      }
    }
    throw "Input is not a JSON Schema, so it cannot be processed."
  }


  /**
   * Unless the schema states one that is not supported we assume its of type JSON Schema
   * 
   * @param input 
   */
  shouldProcess(input: any): boolean {
    if (input.$schema !== undefined) {
      switch (input.$schema) {
        case 'http://json-schema.org/draft-07/schema#':
          return true;
        default:
          return false;
      }
    }
    return true;
  }

  /**
   * Process a draft 7 schema
   * 
   * @param input to process as draft 7
   */
  private async processDraft7(input: any): Promise<CommonInputModel> {
    const refParser = new $RefParser;
    const commonInputModel = new CommonInputModel();
    const localPath = `${process.cwd()}${path.sep}`;
    commonInputModel.originalInput = Schema.toSchema(input);
    await refParser.dereference(localPath,
      input, {
      continueOnError: true,
      dereference: { circular: 'ignore' },
    });
    const parsedSchema = ParsedSchema.toParsedSchema(input);
    if (refParser.$refs.circular && typeof parsedSchema !== "boolean"){
      await refParser.dereference(localPath,
        parsedSchema, {
        continueOnError: true,
        dereference: { circular: true },
      });
      this.markCircularSchemas(parsedSchema);
    }

    commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(parsedSchema, commonInputModel.originalInput);
    return commonInputModel;
  }

  /**
   * Marks all recursive schemas as circular.
   */
  private markCircularSchemas(schema: ParsedSchema | boolean) {
    if(typeof schema === "boolean") return;
    const seenObj: ParsedSchema[] = [];
    const lastSchema: ParsedSchema[] = [];

    //Mark the schema as recursive
    const markCircular = (schema: ParsedSchema, prop?: string) => {
      if (schema.type === 'array') return schema.isCircular = true;
      const circPropsList = schema.circularProps || [];
      if (prop !== undefined) {
        circPropsList.push(prop);
      }
      schema.circularProps = circPropsList;
    };

    //callback to use for iterating through the schemas
    const circularCheckCallback: TraverseSchemaCallback = (schema, type, propName) => {
      switch (type) {
        case SchemaIteratorCallbackType.END_SCHEMA:
          lastSchema.pop();
          seenObj.pop();
          break;
        case SchemaIteratorCallbackType.NEW_SCHEMA:
          if (seenObj.includes(schema)) {
            const schemaToUse = lastSchema.length > 0 ? lastSchema[lastSchema.length - 1] : schema;
            markCircular(schemaToUse, propName);
            return false;
          }
          //Save a list of seen objects and last schema which should be marked if its recursive
          seenObj.push(schema);
          lastSchema.push(schema);
          return true;
      }
      return true;
    };
    traverseSchema(schema, circularCheckCallback);
  }

  /**
   * Simplifies a JSON Schema into a common models
   * 
   * @param schema to simplify to common model
   */
  static convertSchemaToCommonModel(schema: Schema | boolean, original? : Schema | boolean): { [key: string]: CommonModel } {
    if(original === undefined) original = schema;
    const simplifier = new Simplifier();
    const commonModels = simplifier.simplify(schema);
    const commonModelsMap: { [key: string]: CommonModel } = {};
    commonModels.forEach((value) => {
      if (value.$id) {
        commonModelsMap[value.$id] = value;
      }
    });
    return commonModelsMap;
  }
}
