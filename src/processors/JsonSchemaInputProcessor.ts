import { AbstractInputProcessor } from './AbstractInputProcessor';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import path from 'path';
import { Schema, CommonModel, CommonInputModel} from '../models';
import { Logger } from '../utils';
import { postInterpretModel } from '../interpreter/PostInterpreter';
import { Interpreter } from '../interpreter/Interpreter';

/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function for processing a JSON Schema input.
   * 
   * @param input 
   */
  process(input: Record<string, any>): Promise<CommonInputModel> {
    if (this.shouldProcess(input)) {
      if (input.$schema !== undefined) {
        if (input.$schema === 'http://json-schema.org/draft-07/schema#') {
          return this.processDraft7(input);
        }
      } else {
        return this.processDraft7(input);
      }
    }
    return Promise.reject(new Error('Input is not a JSON Schema, so it cannot be processed.'));
  }

  /**
   * Unless the schema states one that is not supported we assume its of type JSON Schema
   * 
   * @param input 
   */
  shouldProcess(input: Record<string, any>): boolean {
    if (input.$schema !== undefined) {
      if (input.$schema === 'http://json-schema.org/draft-07/schema#') {
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Process a draft 7 schema
   * 
   * @param input to process as draft 7
   */
  private async processDraft7(input: Record<string, any>) : Promise<CommonInputModel> {
    Logger.debug('Processing input as an AsyncAPI document');
    input = JsonSchemaInputProcessor.reflectSchemaNames(input, undefined, 'root', true) as Record<string, any>;
    const refParser = new $RefParser;
    const commonInputModel = new CommonInputModel();
    // eslint-disable-next-line no-undef
    const localPath = `${process.cwd()}${path.sep}`;
    commonInputModel.originalInput = Schema.toSchema(input);
    const deRefOption: $RefParser.Options = {
      continueOnError: true,
      dereference: { circular: true },
    };
    Logger.debug(`Trying to dereference all $ref instances from input, using option ${JSON.stringify(deRefOption)}.`);
    try {
      await refParser.dereference(localPath, input, deRefOption);
    } catch (e) {
      const errorMessage = `Could not dereference $ref in input, is all the references correct? ${e.message}`;
      Logger.error(errorMessage, e);
      throw new Error(errorMessage);
    }
    const parsedSchema = Schema.toSchema(input);
    Logger.debug('Successfully dereferenced all $ref instances from input.', parsedSchema);
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
    if (typeof schema === 'boolean') {return schema;}

    schema = Object.assign({}, schema);
    if (isRoot) {
      namesStack[String(name)] = 0;
      schema[this.MODELGEN_INFFERED_NAME] = name;
      name = '';
    } else if (name && !schema[this.MODELGEN_INFFERED_NAME]) {
      let occurrence = namesStack[String(name)];
      if (occurrence === undefined) {
        namesStack[String(name)] = 0;
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
      for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
        properties[String(propertyName)] = this.reflectSchemaNames(propertySchema, namesStack, this.ensureNamePattern(name, propertyName));
      }
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: { [key: string]: Schema | boolean | string[] } = {};
      for (const [dependencyName, dependency] of Object.entries(schema.dependencies)) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.reflectSchemaNames(dependency, namesStack, this.ensureNamePattern(name, dependencyName));
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: { [key: string]: Schema | boolean } = {};
      for (const [idx, [patternPropertyName, patternProperty]] of Object.entries(Object.entries(schema.patternProperties))) {
        patternProperties[String(patternPropertyName)] = this.reflectSchemaNames(patternProperty, namesStack, this.ensureNamePattern(name, 'pattern_property', idx));
      }
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: Schema | boolean } = {};
      for (const [definitionName, definition] of Object.entries(schema.definitions)) {
        definitions[String(definitionName)] = this.reflectSchemaNames(definition, namesStack, this.ensureNamePattern(name, definitionName));
      }
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
    const commonModelsMap: Record<string, CommonModel> = {};
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    if (model === undefined) { return commonModelsMap; }
    const commonModels = postInterpretModel(model);
    for (const commonModel of commonModels) {
      if (commonModel.$id) {
        if (commonModelsMap[commonModel.$id] !== undefined) {
          Logger.warn(`Overwriting existing model with $id ${commonModel.$id}, are there two models with the same id present?`, commonModel);
        }
        commonModelsMap[commonModel.$id] = commonModel;
      } else {
        Logger.warn('Model did not have $id, ignoring.', commonModel);
      }
    }
    return commonModelsMap;
  }
}
