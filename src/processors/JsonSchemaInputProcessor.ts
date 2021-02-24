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
    input = JsonSchemaInputProcessor.reflectSchemaNames(input, undefined, 'root', true);
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
   * Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.
   * 
   * @param schema to process
   * @param namesStack is a aggegator of previous used names
   * @param name to infer
   * @param isRoot indicates if performed schema is a root schema
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static reflectSchemaNames(
    schema: Schema | boolean,
    namesStack: Record<string, number> = {}, 
    name?: string,
    isRoot?: boolean,
  ): Schema | boolean {
    if (typeof schema === 'boolean') return schema;

    schema = Object.assign({}, schema);
    if (isRoot) {
      namesStack[`${name}`] = 0;
      schema[this.MODELGEN_INFFERED_NAME] = name;
      name = '';
    } else if (name && !schema[this.MODELGEN_INFFERED_NAME]) {
      let occurrence = namesStack[`${name}`];
      if (occurrence === undefined) {
        namesStack[`${name}`] = 0;
      } else {
        occurrence++;
      }
      const inferredName = occurrence ? `${name}_${occurrence}` : name;
      schema[this.MODELGEN_INFFERED_NAME] = inferredName;
    }

    if (schema.allOf !== undefined) {
      schema.allOf = schema.allOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'allOf', idx)));
    }
    if (schema.oneOf !== undefined) {
      schema.oneOf = schema.oneOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'oneOf', idx)));
    }
    if (schema.anyOf !== undefined) {
      schema.anyOf = schema.anyOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'anyOf', idx)));
    }
    if (schema.not !== undefined) {
      schema.not = this.reflectSchemaNames(schema.not, namesStack, this.ensureNamePattern(name, 'not'));
    }
    if (
      typeof schema.additionalItems === 'object' &&
      schema.additionalItems !== null
    ) {
      schema.additionalItems = this.reflectSchemaNames(schema.additionalItems, namesStack, this.ensureNamePattern(name, 'additionalItem'));
    }
    if (schema.contains !== undefined) {
      schema.contains = this.reflectSchemaNames(schema.contains, namesStack, this.ensureNamePattern(name, 'contain'));
    }
    if (schema.propertyNames !== undefined) {
      schema.propertyNames = this.reflectSchemaNames(schema.propertyNames, namesStack, this.ensureNamePattern(name, 'propertyName'));
    }
    if (schema.if !== undefined) {
      schema.if = this.reflectSchemaNames(schema.if, namesStack, this.ensureNamePattern(name, 'if'));
    }
    if (schema.then !== undefined) {
      schema.then = this.reflectSchemaNames(schema.then, namesStack, this.ensureNamePattern(name, 'then'));
    }
    if (schema.else !== undefined) {
      schema.else = this.reflectSchemaNames(schema.else, namesStack, this.ensureNamePattern(name, 'else'));
    }
    if (
      typeof schema.additionalProperties === 'object' && 
      schema.additionalProperties !== null
    ) {
      schema.additionalProperties = this.reflectSchemaNames(schema.additionalProperties, namesStack, this.ensureNamePattern(name, 'additionalProperty'));
    }
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items = schema.items.map((item, idx) => this.reflectSchemaNames(item, namesStack, this.ensureNamePattern(name, 'item', idx)));
      } else {
        schema.items = this.reflectSchemaNames(schema.items, namesStack, this.ensureNamePattern(name, 'item'));
      }
    }

    if (schema.properties !== undefined) {
      const properties : {[key: string]: Schema | boolean} = {};
      Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
        properties[`${propertyName}`] = this.reflectSchemaNames(propertySchema, namesStack, this.ensureNamePattern(name, propertyName));
      });
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: { [key: string]: Schema | boolean | string[] } = {};
      Object.entries(schema.dependencies).forEach(([dependencyName, dependency]) => {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[`${dependencyName}`] = this.reflectSchemaNames(dependency, namesStack, this.ensureNamePattern(name, dependencyName));
        } else {
          dependencies[`${dependencyName}`] = dependency as string[];
        }
      });
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.patternProperties).forEach(([patternPropertyName, patternProperty], idx) => {
        patternProperties[`${patternPropertyName}`] = this.reflectSchemaNames(patternProperty, namesStack, this.ensureNamePattern(name, 'pattern_property', idx));
      });
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.definitions).forEach(([definitionName, definition]) => {
        definitions[`${definitionName}`] = this.reflectSchemaNames(definition, namesStack, this.ensureNamePattern(name, definitionName));
      });
      schema.definitions = definitions;
    }

    return schema;
  }

  /**
   * Ensure schema name using previous name and new part
   * 
   * @param previousName to concatenate with
   * @param newParts
   */
  private static ensureNamePattern(previousName: string | undefined, ...newParts: any[]): string {
    const pattern = newParts.map(part => `${part}`).join('_');
    if (!previousName) {
      return pattern;
    }
    return `${previousName}_${pattern}`;
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
