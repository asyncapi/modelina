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

  /**
   * Reflect name from given schema ans save it to `x-modelgen-inferred-name` extension.
   * 
   * It should be removed when we'll simplify current solution for processing schema to CommonModel.
   * 
   * @param schema to process
   * @param namesStack
   * @param pattern
   * @param name
   */
  static reflectSchemaName(
    schema: Schema | boolean,
    namesStack: Record<string, number> = {}, 
    pattern?: string,
    name?: string,
  ): Schema | boolean {
    if (typeof schema === 'boolean') return schema;

    schema = Object.assign({}, schema);
    if (pattern && !schema['x-modelgen-inferred-name']) {
      let occurrence = namesStack[pattern];
      if (occurrence === undefined) {
        namesStack[pattern] = 0;
      } else {
        occurrence++;
      }
      const inferredName = occurrence ? `${pattern}_${occurrence}` : pattern;
      schema['x-modelgen-inferred-name'] = inferredName;
    }

    if (schema.allOf !== undefined) {
      schema.allOf = schema.allOf.map((item, idx) => this.reflectSchemaName(item, namesStack, this.ensureNamePattern(pattern, 'allOf', idx)));
    }
    if (schema.oneOf !== undefined) {
      schema.oneOf = schema.oneOf.map((item, idx) => this.reflectSchemaName(item, namesStack, this.ensureNamePattern(pattern, 'oneOf', idx)));
    }
    if (schema.anyOf !== undefined) {
      schema.anyOf = schema.anyOf.map((item, idx) => this.reflectSchemaName(item, namesStack, this.ensureNamePattern(pattern, 'anyOf', idx)));
    }
    if (schema.not !== undefined) {
      schema.not = this.reflectSchemaName(schema.not, namesStack, this.ensureNamePattern(pattern, 'not'));
    }
    if (
      typeof schema.additionalItems === 'object' &&
      schema.additionalItems !== null
    ) {
      schema.additionalItems = this.reflectSchemaName(schema.additionalItems, namesStack, this.ensureNamePattern(pattern, 'additionalItem'));
    }
    if (schema.contains !== undefined) {
      schema.contains = this.reflectSchemaName(schema.contains, namesStack, this.ensureNamePattern(pattern, 'contain'));
    }
    if (schema.propertyNames !== undefined) {
      schema.propertyNames = this.reflectSchemaName(schema.propertyNames, namesStack, this.ensureNamePattern(pattern, 'propertyName'));
    }
    if (schema.if !== undefined) {
      schema.if = this.reflectSchemaName(schema.if, namesStack, this.ensureNamePattern(pattern, 'if'));
    }
    if (schema.then !== undefined) {
      schema.then = this.reflectSchemaName(schema.then, namesStack, this.ensureNamePattern(pattern, 'then'));
    }
    if (schema.else !== undefined) {
      schema.else = this.reflectSchemaName(schema.else, namesStack, this.ensureNamePattern(pattern, 'else'));
    }
    if (
      typeof schema.additionalProperties === 'object' && 
      schema.additionalProperties !== null
    ) {
      schema.additionalProperties = this.reflectSchemaName(schema.additionalProperties, namesStack, this.ensureNamePattern(pattern, 'additionalProperty'));
    }
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items = schema.items.map((item, idx) => this.reflectSchemaName(item, namesStack, this.ensureNamePattern(pattern, 'item', idx)));
      } else {
        schema.items = this.reflectSchemaName(schema.items, namesStack, this.ensureNamePattern(pattern, 'item'));
      }
    }

    if (schema.properties !== undefined) {
      const properties : {[key: string]: Schema | boolean} = {};
      Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
        properties[propertyName] = this.reflectSchemaName(propertySchema, namesStack, this.ensureNamePattern(pattern, propertyName), propertyName);
      });
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: { [key: string]: Schema | boolean | string[] } = {};
      Object.entries(schema.dependencies).forEach(([dependencyName, dependency]) => {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[dependencyName] = this.reflectSchemaName(dependency, namesStack, this.ensureNamePattern(pattern, dependencyName), dependencyName);
        } else {
          dependencies[dependencyName] = dependency as string[];
        }
      });
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.patternProperties).forEach(([patternPropertyName, patternProperty]) => {
        patternProperties[patternPropertyName] = this.reflectSchemaName(patternProperty, namesStack, this.ensureNamePattern(pattern, patternPropertyName), patternPropertyName);
      });
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.definitions).forEach(([definitionName, definition]) => {
        definitions[definitionName] = this.reflectSchemaName(definition, namesStack, this.ensureNamePattern(pattern, definitionName), definitionName);
      });
      schema.definitions = definitions;
    }

    return schema;
  }

  /**
   * Ensure schema name using previous pattern and new part
   * 
   * @param previousPattern to concatenate with
   * @param newParts
   */
  private static ensureNamePattern(previousPattern: string | undefined, ...newParts: any[]): string {
    const pattern = newParts.map(part => `${part}`).join('_');
    if (!previousPattern) {
      return pattern
    }
    return `${previousPattern}_${pattern}`;
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
