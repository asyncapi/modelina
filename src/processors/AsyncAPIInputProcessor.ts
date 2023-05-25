/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  createAsyncAPIDocument,
  isAsyncAPIDocument,
  isOldAsyncAPIDocument,
  Parser,
  AsyncAPIDocumentInterface,
  SchemaInterface as AsyncAPISchema
} from '@asyncapi/parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { RamlDTSchemaParser } from '@asyncapi/raml-dt-schema-parser';
import { createDetailedAsyncAPI } from '@asyncapi/parser/cjs/utils';
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
  private parser = new Parser();
  constructor() {
    super();
    this.parser.registerSchemaParser(AvroSchemaParser());
    this.parser.registerSchemaParser(OpenAPISchemaParser());
    this.parser.registerSchemaParser(RamlDTSchemaParser());
  }

  static supportedVersions = [
    '2.0.0',
    '2.1.0',
    '2.2.0',
    '2.3.0',
    '2.4.0',
    '2.5.0',
    '2.6.0'
  ];

  /**
   * Process the input as an AsyncAPI document
   *
   * @param input
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async process(
    input?: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      throw new Error(
        'Input is not an AsyncAPI document so it cannot be processed.'
      );
    }

    Logger.debug('Processing input as an AsyncAPI document');
    let doc: AsyncAPIDocumentInterface;
    const inputModel = new InputMetaModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      const { document, diagnostics } = await this.parser.parse(
        input as any,
        options?.asyncapi || {}
      );
      if (document) {
        doc = document;
      } else {
        const err = new Error(
          'Input is not an correct AsyncAPI document so it cannot be processed.'
        );
        (err as any).diagnostics = diagnostics;
        throw err;
      }
    } else if (AsyncAPIInputProcessor.isFromNewParser(input)) {
      doc = input as AsyncAPIDocumentInterface;
    } else {
      // Is from old parser
      const parsedJSON = input.json();
      const detailed = createDetailedAsyncAPI(parsedJSON, parsedJSON);
      doc = createAsyncAPIDocument(detailed);
    }

    inputModel.originalInput = doc;
    // Go over all the message payloads and convert them to models
    for (const message of doc.allMessages()) {
      const payload = message.payload();
      if (payload) {
        const schema = AsyncAPIInputProcessor.convertToInternalSchema(payload);
        const newCommonModel =
          JsonSchemaInputProcessor.convertSchemaToCommonModel(schema, options);
        if (newCommonModel.$id !== undefined) {
          if (inputModel.models[newCommonModel.$id] !== undefined) {
            Logger.warn(
              `Overwriting existing model with $id ${newCommonModel.$id}, are there two models with the same id present?`,
              newCommonModel
            );
          }
          const metaModel = convertToMetaModel(newCommonModel);
          inputModel.models[metaModel.name] = metaModel;
        } else {
          Logger.warn(
            'Model did not have $id which is required, ignoring.',
            newCommonModel
          );
        }
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
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchema | boolean,
    alreadyIteratedSchemas: Map<string, AsyncapiV2Schema> = new Map()
  ): AsyncapiV2Schema | boolean {
    if (typeof schema === 'boolean') {
      return schema;
    }

    let schemaUid = schema.id();
    //Because the constraint functionality of generators cannot handle -, <, >, we remove them from the id if it's an anonymous schema.
    if (
      typeof schemaUid !== 'undefined' &&
      schemaUid.includes('<anonymous-schema')
    ) {
      schemaUid = schemaUid
        .replace('<', '')
        .replace(/-/g, '_')
        .replace('>', '');
    }

    if (alreadyIteratedSchemas.has(schemaUid)) {
      return alreadyIteratedSchemas.get(schemaUid) as AsyncapiV2Schema;
    }

    const convertedSchema = Object.assign(
      new AsyncapiV2Schema(),
      schema.json()
    );
    convertedSchema[this.MODELGEN_INFFERED_NAME] = schemaUid;
    alreadyIteratedSchemas.set(schemaUid, convertedSchema);

    if (schema.allOf()) {
      convertedSchema.allOf = schema
        .allOf()!
        .map((item: any) =>
          this.convertToInternalSchema(item, alreadyIteratedSchemas)
        );
    }
    if (schema.oneOf()) {
      convertedSchema.oneOf = schema
        .oneOf()!
        .map((item: any) =>
          this.convertToInternalSchema(item, alreadyIteratedSchemas)
        );
    }
    if (schema.anyOf()) {
      convertedSchema.anyOf = schema
        .anyOf()!
        .map((item: any) =>
          this.convertToInternalSchema(item, alreadyIteratedSchemas)
        );
    }
    if (schema.not()) {
      convertedSchema.not = this.convertToInternalSchema(
        schema.not()!,
        alreadyIteratedSchemas
      );
    }
    if (
      typeof schema.additionalItems() === 'object' &&
      schema.additionalItems() !== null
    ) {
      convertedSchema.additionalItems = this.convertToInternalSchema(
        schema.additionalItems(),
        alreadyIteratedSchemas
      );
    }
    if (schema.contains()) {
      convertedSchema.contains = this.convertToInternalSchema(
        schema.contains()!,
        alreadyIteratedSchemas
      );
    }
    if (schema.propertyNames()) {
      convertedSchema.propertyNames = this.convertToInternalSchema(
        schema.propertyNames()!,
        alreadyIteratedSchemas
      );
    }
    if (schema.if()) {
      convertedSchema.if = this.convertToInternalSchema(
        schema.if()!,
        alreadyIteratedSchemas
      );
    }
    if (schema.then()) {
      convertedSchema.then = this.convertToInternalSchema(
        schema.then()!,
        alreadyIteratedSchemas
      );
    }
    if (schema.else()) {
      convertedSchema.else = this.convertToInternalSchema(
        schema.else()!,
        alreadyIteratedSchemas
      );
    }
    if (
      typeof schema.additionalProperties() === 'object' &&
      schema.additionalProperties() !== null
    ) {
      convertedSchema.additionalProperties = this.convertToInternalSchema(
        schema.additionalProperties(),
        alreadyIteratedSchemas
      );
    }
    if (schema.items()) {
      if (Array.isArray(schema.items())) {
        convertedSchema.items = (schema.items() as AsyncAPISchema[]).map(
          (item) => this.convertToInternalSchema(item),
          alreadyIteratedSchemas
        );
      } else {
        convertedSchema.items = this.convertToInternalSchema(
          schema.items() as AsyncAPISchema,
          alreadyIteratedSchemas
        );
      }
    }

    const schemaProperties = schema.properties();
    if (schemaProperties && Object.keys(schemaProperties).length) {
      const properties: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [propertyName, propertySchema] of Object.entries(
        schemaProperties
      )) {
        properties[String(propertyName)] = this.convertToInternalSchema(
          propertySchema,
          alreadyIteratedSchemas
        );
      }
      convertedSchema.properties = properties;
    }

    const schemaDependencies = schema.dependencies();
    if (schemaDependencies && Object.keys(schemaDependencies).length) {
      const dependencies: {
        [key: string]: AsyncapiV2Schema | boolean | string[];
      } = {};
      for (const [dependencyName, dependency] of Object.entries(
        schemaDependencies
      )) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.convertToInternalSchema(
            dependency,
            alreadyIteratedSchemas
          );
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      convertedSchema.dependencies = dependencies;
    }

    const schemaPatternProperties = schema.patternProperties();
    if (
      schemaPatternProperties &&
      Object.keys(schemaPatternProperties).length
    ) {
      const patternProperties: { [key: string]: AsyncapiV2Schema | boolean } =
        {};
      for (const [patternPropertyName, patternProperty] of Object.entries(
        schemaPatternProperties
      )) {
        patternProperties[String(patternPropertyName)] =
          this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
      }
      convertedSchema.patternProperties = patternProperties;
    }

    const schemaDefinitions = schema.definitions();
    if (schemaDefinitions && Object.keys(schemaDefinitions).length) {
      const definitions: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [definitionName, definition] of Object.entries(
        schemaDefinitions
      )) {
        definitions[String(definitionName)] = this.convertToInternalSchema(
          definition,
          alreadyIteratedSchemas
        );
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
  shouldProcess(input?: any): boolean {
    if (!input) {
      return false;
    }
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {
      return false;
    }
    return AsyncAPIInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   *
   * @param input
   */
  tryGetVersionOfDocument(input?: any): string | undefined {
    if (!input) {
      return;
    }
    if (AsyncAPIInputProcessor.isFromParser(input)) {
      return input.version();
    }
    return input && input.asyncapi;
  }

  /**
   * Figure out if input is from the AsyncAPI parser.
   *
   * @param input
   */
  static isFromParser(input?: any): boolean {
    return isOldAsyncAPIDocument(input) || this.isFromNewParser(input);
  }

  /**
   * Figure out if input is from the new AsyncAPI parser.
   *
   * @param input
   */
  static isFromNewParser(input?: any): boolean {
    return isAsyncAPIDocument(input);
  }
}
