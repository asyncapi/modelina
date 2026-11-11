/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  isAsyncAPIDocument,
  isOldAsyncAPIDocument,
  AsyncAPIDocumentInterface,
  SchemaInterface as AsyncAPISchemaInterface,
  SchemaV2 as AsyncAPISchema,
  fromFile,
  createAsyncAPIDocument,
  MessagesInterface,
  ChannelInterface,
  OperationInterface,
  OperationReplyInterface
} from '@asyncapi/parser';
import yaml from 'js-yaml';
import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { InputMetaModel, ProcessorOptions } from '../models';
import { Logger } from '../utils';
import { AsyncapiV2Schema } from '../models/AsyncapiV2Schema';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  ConvertDocumentParserAPIVersion,
  NewParser
} from '@asyncapi/multi-parser';
import { createDetailedAsyncAPI } from '@asyncapi/parser/cjs/utils';

/**
 * Class for processing AsyncAPI inputs
 */
export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  static supportedVersions = [
    '2.0.0',
    '2.1.0',
    '2.2.0',
    '2.3.0',
    '2.4.0',
    '2.5.0',
    '2.6.0',
    '3.0.0'
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
    const rawInput = input;
    let doc: AsyncAPIDocumentInterface | undefined;

    if (!this.shouldProcess(rawInput)) {
      throw new Error(
        'Input is not an AsyncAPI document so it cannot be processed.'
      );
    }

    Logger.debug('Processing input as an AsyncAPI document');
    const inputModel = new InputMetaModel();
    if (isOldAsyncAPIDocument(rawInput)) {
      // Is from old parser
      const parsedJSON = rawInput.json();
      const detailed = createDetailedAsyncAPI(parsedJSON, parsedJSON);
      doc = createAsyncAPIDocument(detailed);
    } else if (AsyncAPIInputProcessor.isFromNewParser(rawInput)) {
      doc = ConvertDocumentParserAPIVersion(rawInput, 2) as any;
    } else {
      const parserOptions = options?.asyncapi || {};
      const parser = NewParser(3, {
        parserOptions,
        includeSchemaParsers: true
      });

      let parserResult;
      if (this.isFileInput(input)) {
        const filePath = fileURLToPath(input);
        /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as it just checks file existance */
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exists.');
        }
        parserResult = await fromFile(parser as any, filePath).parse();
      } else {
        parserResult = await parser.parse(rawInput, parserOptions);
      }
      const { document, diagnostics } = parserResult;
      if (document) {
        doc = document as unknown as AsyncAPIDocumentInterface;
      } else {
        const err = new Error(
          'Input is not an correct AsyncAPI document so it cannot be processed.'
        );
        (err as any).diagnostics = diagnostics;
        throw err;
      }
    }
    if (!doc) {
      throw new Error('Could not parse input as AsyncAPI document');
    }

    inputModel.originalInput = doc;

    // Go over all the message payloads and convert them to models
    const channels = doc.channels();

    if (channels.length) {
      for (const channel of channels) {
        this.processChannel(channel, inputModel, options);
      }
    } else {
      for (const message of doc.allMessages()) {
        const payload = message.payload();
        if (payload) {
          this.addToInputModel(payload, inputModel, options);
        }
      }
    }

    return inputModel;
  }

  private addToInputModel(
    payload: AsyncAPISchemaInterface,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ): void {
    const schema = AsyncAPIInputProcessor.convertToInternalSchema(payload);
    const newMetaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
      schema,
      options
    );
    if (inputModel.models[newMetaModel.name] !== undefined) {
      Logger.warn(
        `Overwriting existing model with name ${newMetaModel.name}, are there two models with the same name present? Overwriting the old model.`,
        newMetaModel.name
      );
    }
    inputModel.models[newMetaModel.name] = newMetaModel;
  }

  private resolveOperationUnionId(
    channel: ChannelInterface,
    operation: OperationInterface,
    operationsCount: number,
    inputModel: InputMetaModel
  ): string {
    const opId = operation.id();
    const channelId = channel.id();
    const hasCollisionRisk =
      operationsCount > 1 ||
      Object.prototype.hasOwnProperty.call(inputModel.models, channelId);
    if (hasCollisionRisk && opId) {
      return opId;
    }
    return channelId;
  }

  private resolveReplyUnionId(
    channel: ChannelInterface,
    operation: OperationInterface,
    replyOperation: OperationReplyInterface
  ): string {
    return (
      replyOperation.channel()?.id() ||
      `${operation.id() || channel.id()}_reply`
    );
  }

  private processMessages(
    messages: MessagesInterface,
    unionId: string,
    channel: ChannelInterface,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ): void {
    if (messages.length === 0) {
      return;
    }
    if (messages.length === 1) {
      const payload = messages[0].payload();
      if (payload) {
        this.addToInputModel(payload, inputModel, options);
      }
      return;
    }

    // treat multiple messages as oneOf
    const oneOf: any[] = [];
    for (const message of messages) {
      const payload = message.payload();
      if (!payload) {
        continue;
      }

      // Add each individual message payload as a separate model
      this.addToInputModel(payload, inputModel, options);
      oneOf.push(payload.json());
    }

    const payload = new AsyncAPISchema(
      {
        $id: unionId,
        oneOf
      },
      channel.meta()
    );
    this.addToInputModel(payload, inputModel, options);
  }

  private processChannel(
    channel: ChannelInterface,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ): void {
    const operations = channel.operations();
    for (const operation of operations) {
      const replyOperation = operation.reply();
      if (replyOperation !== undefined) {
        const replyMessages = replyOperation.messages();
        const messagesToProcess =
          replyMessages.length > 0
            ? replyMessages
            : replyOperation.channel()?.messages();
        if (messagesToProcess) {
          const replyId = this.resolveReplyUnionId(
            channel,
            operation,
            replyOperation
          );
          this.processMessages(
            messagesToProcess,
            replyId,
            channel,
            inputModel,
            options
          );
        }
      }

      const unionId = this.resolveOperationUnionId(
        channel,
        operation,
        operations.length,
        inputModel
      );
      this.processMessages(
        operation.messages(),
        unionId,
        channel,
        inputModel,
        options
      );
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
    schema: AsyncAPISchemaInterface | boolean,
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

    const convertedSchema = AsyncapiV2Schema.toSchema(schema.json());
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
        convertedSchema.items = (
          schema.items() as AsyncAPISchemaInterface[]
        ).map(
          (item) => this.convertToInternalSchema(item),
          alreadyIteratedSchemas
        );
      } else {
        convertedSchema.items = this.convertToInternalSchema(
          schema.items() as AsyncAPISchemaInterface,
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
          dependencies[String(dependencyName)] = dependency;
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
    if (this.isFileInput(input)) {
      return true;
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
    if (typeof input === 'string') {
      //If string input, it could be stringified JSON or YAML format, lets check
      let loadedObj;
      try {
        loadedObj = yaml.load(input);
      } catch (e) {
        try {
          loadedObj = JSON.parse(input);
        } catch (e) {
          return undefined;
        }
      }
      return loadedObj?.asyncapi;
    }
    if (AsyncAPIInputProcessor.isFromParser(input)) {
      return input.version();
    }
    return input?.asyncapi;
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

  isFileInput(input: any): boolean {
    // prettier-ignore
    return typeof input === 'string' && (/^file:\/\//g).test(input);
  }
}
