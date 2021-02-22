import { AbstractInputProcessor } from './AbstractInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';
import { CommonModel } from '../models/CommonModel';
import {simplify} from '../simplification/Simplifier';
import { Schema } from '../models/Schema';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import path from 'path';

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
    throw new Error('Input is not a JSON Schema, so it cannot be processed.');
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
  private async processDraft7(input: any) : Promise<CommonInputModel> {
    input = JsonSchemaInputProcessor.reflectSchemaName(input);
    const refParser = new $RefParser;
    const commonInputModel = new CommonInputModel();
    // eslint-disable-next-line no-undef
    const localPath = `${process.cwd()}${path.sep}`;
    commonInputModel.originalInput = Schema.toSchema(input);
    await refParser.dereference(localPath, 
      input, {
        continueOnError: true,
        dereference: { circular: 'ignore' },
      });
    const parsedSchema = Schema.toSchema(input);
    if (refParser.$refs.circular && typeof parsedSchema !== 'boolean') {
      const circularOption : $RefParser.Options = {
        continueOnError: true,
        dereference: { circular: true },
      };
      await refParser.dereference(localPath, parsedSchema as $RefParser.JSONSchema, circularOption);
    }
    commonInputModel.models = JsonSchemaInputProcessor.convertSchemaToCommonModel(parsedSchema);
    return commonInputModel;
  }

  // it should be removed when we'll simplify current solution for processing schema to CommonModel
  static reflectSchemaName(schema: Schema | boolean, namesStack: string[] = [], name?: string): Schema | boolean {
    if (typeof schema === 'boolean') return schema;

    schema = Object.assign({}, schema);
    if (name && !schema['x-modelgen-inferred-name']) {
      schema['x-modelgen-inferred-name'] = name;
    }

    if (schema.allOf !== undefined) {
      schema.allOf = schema.allOf.map((item, idx) => this.reflectSchemaName(item, namesStack));
    }
    if (schema.oneOf !== undefined) {
      schema.oneOf = schema.oneOf.map((item, idx) => this.reflectSchemaName(item, namesStack));
    }
    if (schema.anyOf !== undefined) {
      schema.anyOf = schema.anyOf.map((item, idx) => this.reflectSchemaName(item, namesStack));
    }
    if (schema.not !== undefined) {
      schema.not = this.reflectSchemaName(schema.not, namesStack);
    }
    if (
      typeof schema.additionalItems === 'object' &&
      schema.additionalItems !== null
    ) {
      schema.additionalItems = this.reflectSchemaName(schema.additionalItems, namesStack);
    }
    if (schema.contains !== undefined) {
      schema.contains = this.reflectSchemaName(schema.contains, namesStack);
    }
    if (schema.propertyNames !== undefined) {
      schema.propertyNames = this.reflectSchemaName(schema.propertyNames, namesStack);
    }
    if (schema.if !== undefined) {
      schema.if = this.reflectSchemaName(schema.if, namesStack);
    }
    if (schema.then !== undefined) {
      schema.then = this.reflectSchemaName(schema.then, namesStack);
    }
    if (schema.else !== undefined) {
      schema.else = this.reflectSchemaName(schema.else, namesStack);
    }
    if (
      typeof schema.additionalProperties === 'object' && 
      schema.additionalProperties !== null
    ) {
      schema.additionalProperties = this.reflectSchemaName(schema.additionalProperties, namesStack);
    }
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items = schema.items.map((item) => this.reflectSchemaName(item, namesStack));
      } else {
        schema.items = this.reflectSchemaName(schema.items, namesStack);
      }
    }

    if (schema.properties !== undefined) {
      const properties : {[key: string]: Schema | boolean} = {};
      Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
        properties[propertyName] = this.reflectSchemaName(propertySchema, namesStack, propertyName);
      });
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: { [key: string]: Schema | boolean | string[] } = {};
      Object.entries(schema.dependencies).forEach(([propertyName, property]) => {
        if (typeof property === 'object' && !Array.isArray(property)) {
          dependencies[propertyName] = this.reflectSchemaName(property, namesStack, propertyName);
        } else {
          dependencies[propertyName] = property as string[];
        }
      });
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.patternProperties).forEach(([propertyName, property]) => {
        patternProperties[propertyName] = this.reflectSchemaName(property, namesStack, propertyName);
      });
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.definitions).forEach(([propertyName, property]) => {
        definitions[propertyName] = this.reflectSchemaName(property, namesStack, propertyName);
      });
      schema.definitions = definitions;
    }

    return schema;
  }

  /**
   * Simplifies a JSON Schema into a common models
   * 
   * @param schema to simplify to common model
   */
  static convertSchemaToCommonModel(schema: Schema | boolean): Record<string, CommonModel> {
    const commonModels = simplify(schema);
    const commonModelsMap: Record<string, CommonModel> = {};
    commonModels.forEach(value => {
      if (value.$id) {
        commonModelsMap[value.$id] = value;
      }
    });
    return commonModelsMap;
  }
}
