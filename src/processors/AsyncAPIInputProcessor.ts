import {parse, AsyncAPIDocument, Schema as AsyncAPISchema} from '@asyncapi/parser';

import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel, Schema } from '../models';
import { Logger } from '../utils';

/**
 * Class for processing AsyncAPI inputs
 */
export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  /**
   * Process the input as an AsyncAPI document
   * 
   * @param input 
   */
  async process(input: any): Promise<CommonInputModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not an AsyncAPI document so it cannot be processed.');}
    Logger.debug('Processing input as an AsyncAPI document');
    let doc: AsyncAPIDocument;
    const common = new CommonInputModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      doc = await parse(input);
    } else {
      doc = input;
    }
    common.originalInput = doc;
    
    doc.allMessages().forEach((message) => {
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(message.payload());
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(schema);
      common.models = {...common.models, ...commonModels};
    });
    return common;
  }

  /**
   * 
   * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension. 
   * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
   * 
   * @param schema to reflect name for
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchema | boolean,
    alreadyIteratedSchemas: Map<string, Schema> = new Map()
  ): Schema | boolean {
    if (typeof schema === 'boolean') {return schema;}
    const schemaUid = schema.uid();
    if (alreadyIteratedSchemas.has(schemaUid)) {
      return alreadyIteratedSchemas.get(schemaUid) as Schema; 
    }
    let convertedSchema = new Schema();
    alreadyIteratedSchemas.set(schemaUid, convertedSchema);
    convertedSchema = Object.assign({}, schema.json());
    convertedSchema[this.MODELGEN_INFFERED_NAME] = schemaUid;

    if (schema.allOf() !== null) {
      convertedSchema.allOf = schema.allOf().map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.oneOf() !== null) {
      convertedSchema.oneOf = schema.oneOf().map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.anyOf() !== null) {
      convertedSchema.anyOf = schema.anyOf().map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.not() !== null) {
      convertedSchema.not = this.convertToInternalSchema(schema.not(), alreadyIteratedSchemas);
    }
    if (
      typeof schema.additionalItems() === 'object' &&
      schema.additionalItems() !== null
    ) {
      convertedSchema.additionalItems = this.convertToInternalSchema(schema.additionalItems(), alreadyIteratedSchemas);
    }
    if (schema.contains() !== null) {
      convertedSchema.contains = this.convertToInternalSchema(schema.contains(), alreadyIteratedSchemas);
    }
    if (schema.propertyNames() !== null) {
      convertedSchema.propertyNames = this.convertToInternalSchema(schema.propertyNames(), alreadyIteratedSchemas);
    }
    if (schema.if() !== null) {
      convertedSchema.if = this.convertToInternalSchema(schema.if(), alreadyIteratedSchemas);
    }
    if (schema.then() !== null) {
      convertedSchema.then = this.convertToInternalSchema(schema.then(), alreadyIteratedSchemas);
    }
    if (schema.else() !== null) {
      convertedSchema.else = this.convertToInternalSchema(schema.else(), alreadyIteratedSchemas);
    }
    if (
      typeof schema.additionalProperties() === 'object' && 
      schema.additionalProperties() !== null
    ) {
      convertedSchema.additionalProperties = this.convertToInternalSchema(schema.additionalProperties(), alreadyIteratedSchemas);
    }
    if (schema.items() !== null) {
      if (Array.isArray(schema.items())) {
        convertedSchema.items = (schema.items() as AsyncAPISchema[]).map((item) => this.convertToInternalSchema(item), alreadyIteratedSchemas);
      } else {
        convertedSchema.items = this.convertToInternalSchema(schema.items() as AsyncAPISchema, alreadyIteratedSchemas);
      }
    }

    if (schema.properties() !== null && Object.keys(schema.properties()).length) {
      const properties : {[key: string]: Schema | boolean} = {};
      Object.entries(schema.properties()).forEach(([propertyName, propertySchema]) => {
        properties[String(propertyName)] = this.convertToInternalSchema(propertySchema, alreadyIteratedSchemas);
      });
      convertedSchema.properties = properties;
    }
    if (schema.dependencies() !== null && Object.keys(schema.dependencies()).length) {
      const dependencies: { [key: string]: Schema | boolean | string[] } = {};
      Object.entries(schema.dependencies()).forEach(([dependencyName, dependency]) => {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.convertToInternalSchema(dependency, alreadyIteratedSchemas);
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      });
      convertedSchema.dependencies = dependencies;
    }
    if (schema.patternProperties() !== null && Object.keys(schema.patternProperties()).length) {
      const patternProperties: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.patternProperties()).forEach(([patternPropertyName, patternProperty]) => {
        patternProperties[String(patternPropertyName)] = this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
      });
      convertedSchema.patternProperties = patternProperties;
    }
    if (schema.definitions() !== null && Object.keys(schema.definitions()).length) {
      const definitions: { [key: string]: Schema | boolean } = {};
      Object.entries(schema.definitions()).forEach(([definitionName, definition]) => {
        definitions[String(definitionName)] = this.convertToInternalSchema(definition, alreadyIteratedSchemas);
      });
      convertedSchema.definitions = definitions;
    }

    return convertedSchema;
  }
  /**
	 * Figures out if an object is of type AsyncAPI document
	 * 
	 * @param input 
	 */
  shouldProcess(input: any) : boolean {
    //Check if we got a parsed document from out parser
    //Check if we just got provided a pure object
    if (typeof input === 'object' && (AsyncAPIInputProcessor.isFromParser(input) || input.asyncapi !== undefined)) {
      return true;
    }
    return false;
  }

  /**
   * Figure out if input is from our parser.
   * 
   * @param input 
   */
  static isFromParser(input: any) {
    if (input._json !== undefined && 
      input._json.asyncapi !== undefined && 
      typeof input.version === 'function') {
      return true;
    }
    return false;
  }
}
