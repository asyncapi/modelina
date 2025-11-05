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
  MessagesInterface
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

    const addToInputModel = (
      payload: AsyncAPISchemaInterface,
      inferredName?: string
    ) => {
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        payload,
        new Map(),
        inferredName
      );
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
    };

    // Go over all the message payloads and convert them to models
    const channels = doc.channels();

    if (channels.length) {
      for (const channel of doc.channels()) {
        for (const operation of channel.operations()) {
          const handleMessages = (messages: MessagesInterface) => {
            // treat multiple messages as oneOf
            if (messages.length > 1) {
              const oneOf: any[] = [];

              for (const message of messages) {
                const payload = message.payload();

                if (!payload) {
                  continue;
                }

                // Add each individual message payload as a separate model
                addToInputModel(payload);
                oneOf.push(payload.json());
              }

              const payload = new AsyncAPISchema(
                {
                  $id: channel.id(),
                  oneOf
                },
                channel.meta()
              );

              addToInputModel(payload);
            } else if (messages.length === 1) {
              const message = messages[0];
              const payload = message.payload();
              if (payload) {
                // Use message id with 'Payload' suffix as the inferred name for the payload schema
                // This avoids potential collisions with component schemas that might have the same name
                const messageName = message.id()
                  ? `${message.id()}Payload`
                  : undefined;
                addToInputModel(payload, messageName);
              }
            }
          };
          const replyOperation = operation.reply();
          if (replyOperation !== undefined) {
            const replyMessages = replyOperation.messages();
            if (replyMessages.length > 0) {
              handleMessages(replyMessages);
            } else {
              const replyChannelMessages = replyOperation.channel()?.messages();
              if (replyChannelMessages) {
                handleMessages(replyChannelMessages);
              }
            }
          }
          handleMessages(operation.messages());
        }
      }
    } else {
      for (const message of doc.allMessages()) {
        const payload = message.payload();
        if (payload) {
          // Use message id with 'Payload' suffix as the inferred name for the payload schema
          // This avoids potential collisions with component schemas that might have the same name
          const messageName = message.id()
            ? `${message.id()}Payload`
            : undefined;
          addToInputModel(payload, messageName);
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
   * @param alreadyIteratedSchemas map of already processed schemas
   * @param inferredName optional name to use instead of the schema id (e.g., message name)
   */
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchemaInterface | boolean,
    alreadyIteratedSchemas: Map<string, AsyncapiV2Schema> = new Map(),
    inferredName?: string
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
      // If an inferred name is provided and this is an anonymous schema, use the inferred name
      // Only use inferred name if it's not also an anonymous message
      if (inferredName && !inferredName.includes('<anonymous-message')) {
        schemaUid = inferredName;
      } else {
        schemaUid = schemaUid
          .replace('<', '')
          .replace(/-/g, '_')
          .replace('>', '');
      }
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
