import { Parser } from '@asyncapi/parser';
import type { AsyncAPIDocumentInterface, SchemaInterface as AsyncAPISchema } from '@asyncapi/parser';
import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonModel, Draft4Schema, Draft6Schema, Draft7Schema, InputMetaModel, OpenapiV3Schema, ProcessorOptions } from '../models';
import { Logger } from '../utils';
import { AsyncapiV2Schema } from '../models/AsyncapiV2Schema';
import { convertToMetaModel } from '../helpers';
import { OpenAPIInputProcessor } from './OpenAPIInputProcessor';
import type { AsyncAPIDocumentInterface, SchemaInterface as AsyncAPISchema } from '@asyncapi/parser';


/**
 * Class for processing AsyncAPI inputs
 */
export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  private parser = new Parser();

  static supportedVersions = ['2.0.0', '2.1.0', '2.2.0', '2.3.0', '2.4.0', '2.5.0'];
  static supportedJsonSchema7Formats = [
    'application/schema+json;version=draft-07',
    'application/schema+yaml;version=draft-07'
  ];
  static supportedJsonSchema6Formats = [
    'application/schema+json;version=draft-06',
    'application/schema+yaml;version=draft-06'
  ];
  static supportedJsonSchema4Formats = [
    'application/schema+json;version=draft-04',
    'application/schema+yaml;version=draft-04'
  ];
  static supportedAsyncAPIFormats = [
    'application/vnd.aai.asyncapi'
  ]
  static supportedOpenAPIFormats = [
    'application/vnd.oai.openapi;version=3.0.0', 
    'application/vnd.oai.openapi+json;version=3.0.0', 
    'application/vnd.oai.openapi+yaml;version=3.0.0'
  ]

  /**
   * Process the input as an AsyncAPI document
   * 
   * @param input 
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async process(input?: any, options?: ProcessorOptions): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not an AsyncAPI document so it cannot be processed.');}

    Logger.debug('Processing input as an AsyncAPI document');
    let doc: AsyncAPIDocumentInterface;
    const inputModel = new InputMetaModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      const { document, diagnostics } = await this.parser.parse(input as any, options?.asyncapi || {});
      if (document) {
        doc = document;
      } else {
        const err = new Error('Input is not an correct AsyncAPI document so it cannot be processed.');
        (err as any).diagnostics = diagnostics;
        throw err;
      }
    } else {
      doc = input as AsyncAPIDocumentInterface;
    }

    inputModel.originalInput = doc;
    // Go over all the message payloads and convert them to models
    for (const message of doc.allMessages()) {
      const payload = message.payload();
      if (payload) {
        const newCommonModel = this.tryProcessMessage(message);
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
    }
    return inputModel;
  }

  /**
   * Because AsyncAPI allows you to use different types of schema formats for defining message payloads
   * we have to handle each individual case to figure out how to interpret them.
   * 
   * @param message 
   */
  private tryProcessMessage(message: AsyncAPIMessage): CommonModel | undefined {
    const messagePayload = message.originalPayload(); 
    let schema;
    // Default to AsyncAPI schema
    const isAsyncAPISchema = message.schemaFormat() === undefined || AsyncAPIInputProcessor.supportedAsyncAPIFormats.some(v => message.schemaFormat().includes(v));
    const isOpenAPISchema = AsyncAPIInputProcessor.supportedOpenAPIFormats.some(v => message.schemaFormat().includes(v));
    const isJsonSchemaDraft7 = AsyncAPIInputProcessor.supportedJsonSchema7Formats.some(v => message.schemaFormat().includes(v));
    const isJsonSchemaDraft6 = AsyncAPIInputProcessor.supportedJsonSchema6Formats.some(v => message.schemaFormat().includes(v));
    const isJsonSchemaDraft4 = AsyncAPIInputProcessor.supportedJsonSchema4Formats.some(v => message.schemaFormat().includes(v));
    const isJsonSchemaVariant = isAsyncAPISchema || isOpenAPISchema || isJsonSchemaDraft7 || isJsonSchemaDraft6 || isJsonSchemaDraft4;
    if(isJsonSchemaVariant) {
      if(isAsyncAPISchema) {
        schema = AsyncAPIInputProcessor.convertToInternalSchema(message.payload());
      } else if (isOpenAPISchema) {
        schema = OpenapiV3Schema.toSchema(messagePayload);
      } else if (isJsonSchemaDraft7) {
        schema = Draft7Schema.toSchema(messagePayload);
      } else if (isJsonSchemaDraft6) {
        schema = Draft6Schema.toSchema(messagePayload);
      } else if (isJsonSchemaDraft4) {
        schema = Draft4Schema.toSchema(messagePayload);
      } else {
        Logger.error(`AsyncAPI message was unable to be converted, dropping message`);
        return undefined;
      }
      return JsonSchemaInputProcessor.convertSchemaToCommonModel(schema);
    } else {
      Logger.error(`AsyncAPI message could not be processed because it has the format ${message.schemaFormat()}.`);
      return undefined;
    }
  }

  /**
   * 
   * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension. 
   * 
   * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
   * 
   * @param schema to reflect name for
   */
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchema | boolean,
    alreadyIteratedSchemas: Map<string, AsyncapiV2Schema> = new Map()
  ): AsyncapiV2Schema | boolean {
    if (typeof schema === 'boolean') {return schema;}
    
    let schemaUid = schema.id();
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

    if (schema.allOf()) {
      convertedSchema.allOf = schema.allOf()!.map((item: any) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.oneOf()) {
      convertedSchema.oneOf = schema.oneOf()!.map((item: any) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.anyOf()) {
      convertedSchema.anyOf = schema.anyOf()!.map((item: any) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
    }
    if (schema.not()) {
      convertedSchema.not = this.convertToInternalSchema(schema.not()!, alreadyIteratedSchemas);
    }
    if (
      typeof schema.additionalItems() === 'object' &&
      schema.additionalItems() !== null
    ) {
      convertedSchema.additionalItems = this.convertToInternalSchema(schema.additionalItems(), alreadyIteratedSchemas);
    }
    if (schema.contains()) {
      convertedSchema.contains = this.convertToInternalSchema(schema.contains()!, alreadyIteratedSchemas);
    }
    if (schema.propertyNames()) {
      convertedSchema.propertyNames = this.convertToInternalSchema(schema.propertyNames()!, alreadyIteratedSchemas);
    }
    if (schema.if()) {
      convertedSchema.if = this.convertToInternalSchema(schema.if()!, alreadyIteratedSchemas);
    }
    if (schema.then()) {
      convertedSchema.then = this.convertToInternalSchema(schema.then()!, alreadyIteratedSchemas);
    }
    if (schema.else()) {
      convertedSchema.else = this.convertToInternalSchema(schema.else()!, alreadyIteratedSchemas);
    }
    if (
      typeof schema.additionalProperties() === 'object' && 
      schema.additionalProperties() !== null
    ) {
      convertedSchema.additionalProperties = this.convertToInternalSchema(schema.additionalProperties(), alreadyIteratedSchemas);
    }
    if (schema.items()) {
      if (Array.isArray(schema.items())) {
        convertedSchema.items = (schema.items() as AsyncAPISchema[]).map((item) => this.convertToInternalSchema(item), alreadyIteratedSchemas);
      } else {
        convertedSchema.items = this.convertToInternalSchema(schema.items() as AsyncAPISchema, alreadyIteratedSchemas);
      }
    }

    const schemaProperties = schema.properties();
    if (schemaProperties && Object.keys(schemaProperties).length) {
      const properties : {[key: string]: AsyncapiV2Schema | boolean} = {};
      for (const [propertyName, propertySchema] of Object.entries(schemaProperties)) {
        properties[String(propertyName)] = this.convertToInternalSchema(propertySchema, alreadyIteratedSchemas);
      }
      convertedSchema.properties = properties;
    }

    const schemaDependencies = schema.dependencies();
    if (schemaDependencies && Object.keys(schemaDependencies).length) {
      const dependencies: { [key: string]: AsyncapiV2Schema | boolean | string[] } = {};
      for (const [dependencyName, dependency] of Object.entries(schemaDependencies)) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.convertToInternalSchema(dependency, alreadyIteratedSchemas);
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      convertedSchema.dependencies = dependencies;
    }

    const schemaPatternProperties = schema.patternProperties();
    if (schemaPatternProperties && Object.keys(schemaPatternProperties).length) {
      const patternProperties: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [patternPropertyName, patternProperty] of Object.entries(schemaPatternProperties)) {
        patternProperties[String(patternPropertyName)] = this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
      }
      convertedSchema.patternProperties = patternProperties;
    }

    const schemaDefinitions = schema.definitions();
    if (schemaDefinitions && Object.keys(schemaDefinitions).length) {
      const definitions: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [definitionName, definition] of Object.entries(schemaDefinitions)) {
        definitions[String(definitionName)] = this.convertToInternalSchema(definition, alreadyIteratedSchemas);
      }
      convertedSchema.definitions = definitions;
    }

    return convertedSchema;
  }
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  /**
	 * Figures out if an object is of type AsyncAPI document
	 * 
	 * @param input 
	 */
  shouldProcess(input?: any) : boolean {
    if (!input) {return false;}
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {return false;}
    return AsyncAPIInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   * 
   * @param input 
   */
  tryGetVersionOfDocument(input?: any) : string | undefined {
    if (!input) {return;}
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
  static isFromParser(input?: any): boolean {
    if (!input) {return false;}
    if (input['_json'] !== undefined && input['_json'].asyncapi !== undefined && 
      typeof input.version === 'function') {
      return true;
    }
    return false;
  }
}
