import {parse, AsyncAPIDocument, Schema as AsyncAPISchema, ParserOptions} from '@asyncapi/parser';
import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { InputMetaModel, ProcessorOptions } from '../models';
import { Logger } from '../utils';
import { AsyncapiV2Schema } from '../models/AsyncapiV2Schema';
import { convertToMetaModel } from '../helpers';

/**
 * Class for processing AsyncAPI inputs
 */
export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['2.0.0', '2.1.0', '2.2.0', '2.3.0', '2.4.0', '2.5.0'];

  /**
   * Process the input as an AsyncAPI document
   * 
   * @param input 
   */
  async process(input: Record<string, any>, options?: ProcessorOptions): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not an AsyncAPI document so it cannot be processed.');}

    Logger.debug('Processing input as an AsyncAPI document');
    let doc: AsyncAPIDocument;
    const inputModel = new InputMetaModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      doc = await parse(input as any, options?.asyncapi || {} as ParserOptions);
    } else {
      doc = input as AsyncAPIDocument;
    }
    inputModel.originalInput = doc;
    // Go over all the message payloads and convert them to models
    for (const [, message] of doc.allMessages()) {
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(message.payload());
      const newCommonModel = JsonSchemaInputProcessor.convertSchemaToCommonModel(schema);
      if (newCommonModel.$id !== undefined) {
        if (inputModel.models[newCommonModel.$id] !== undefined) {
          Logger.warn(`Overwriting existing model with $id ${newCommonModel.$id}, are there two models with the same id present?`, newCommonModel);
        }
        const metaModel = convertToMetaModel(newCommonModel);
        inputModel.models[metaModel.name] = metaModel;
      } else {
        Logger.warn('Model did not have $id which is required, ignoring.', newCommonModel);
      }
    }
    return inputModel;
  }

  /**
   * 
   * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension. 
   * 
   * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
   * 
   * @param schema to reflect name for
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchema | boolean,
    alreadyIteratedSchemas: Map<string, AsyncapiV2Schema> = new Map()
  ): AsyncapiV2Schema | boolean {
    if (typeof schema === 'boolean') {return schema;}
    
    let schemaUid = schema.uid();
    //Because the constraint functionality of generators cannot handle -, <, >, we remove them from the id if it's an anonymous schema.
    if (schemaUid.includes('<anonymous-schema')) {
      schemaUid = schemaUid.replace('<', '').replace(/-/g, '_').replace('>', '');
    }
    
    if (alreadyIteratedSchemas.has(schemaUid)) {
      return alreadyIteratedSchemas.get(schemaUid) as AsyncapiV2Schema; 
    }

    const convertedSchema = Object.assign(new AsyncapiV2Schema(), schema.json());
    convertedSchema[this.MODELGEN_INFFERED_NAME] = schemaUid;
    alreadyIteratedSchemas.set(schemaUid, convertedSchema);

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
      const properties : {[key: string]: AsyncapiV2Schema | boolean} = {};
      for (const [propertyName, propertySchema] of Object.entries(schema.properties())) {
        properties[String(propertyName)] = this.convertToInternalSchema(propertySchema, alreadyIteratedSchemas);
      }
      convertedSchema.properties = properties;
    }
    if (schema.dependencies() !== null && Object.keys(schema.dependencies()).length) {
      const dependencies: { [key: string]: AsyncapiV2Schema | boolean | string[] } = {};
      for (const [dependencyName, dependency] of Object.entries(schema.dependencies())) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.convertToInternalSchema(dependency, alreadyIteratedSchemas);
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      convertedSchema.dependencies = dependencies;
    }
    if (schema.patternProperties() !== null && Object.keys(schema.patternProperties()).length) {
      const patternProperties: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [patternPropertyName, patternProperty] of Object.entries(schema.patternProperties())) {
        patternProperties[String(patternPropertyName)] = this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
      }
      convertedSchema.patternProperties = patternProperties;
    }
    if (schema.definitions() !== null && Object.keys(schema.definitions()).length) {
      const definitions: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [definitionName, definition] of Object.entries(schema.definitions())) {
        definitions[String(definitionName)] = this.convertToInternalSchema(definition, alreadyIteratedSchemas);
      }
      convertedSchema.definitions = definitions;
    }

    return convertedSchema;
  }
  /**
	 * Figures out if an object is of type AsyncAPI document
	 * 
	 * @param input 
	 */
  shouldProcess(input: Record<string, any>) : boolean {
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {return false;}
    return AsyncAPIInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   * 
   * @param input 
   */
  tryGetVersionOfDocument(input: Record<string, any>) : string | undefined {
    if (AsyncAPIInputProcessor.isFromParser(input)) {
      return input.version();
    }
    return input && input.asyncapi;
  }

  /**
   * Figure out if input is from the AsyncAPI js parser.
   * 
   * @param input 
   */
  static isFromParser(input: Record<string, any>): boolean {
    if (input['_json'] !== undefined && input['_json'].asyncapi !== undefined && 
      typeof input.version === 'function') {
      return true;
    }
    return false;
  }
}
