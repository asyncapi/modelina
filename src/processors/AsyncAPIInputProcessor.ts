/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
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
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  ConvertDocumentParserAPIVersion,
  NewParser
} from '@asyncapi/multi-parser';
import { createDetailedAsyncAPI } from '@asyncapi/parser/cjs/utils';
import { createMetadataPreservingResolver } from './utils';

/**
 * Context information for schema name inference
 */
interface SchemaContext {
  /** Property name if this schema is a property value */
  propertyName?: string;
  /** Parent schema name for building hierarchical names */
  parentName?: string;
  /** Component schema key from components/schemas */
  componentKey?: string;
  /** Message ID if this is a message payload */
  messageId?: string;
  /** True if this schema is an array item */
  isArrayItem?: boolean;
  /** True if this schema is from patternProperties */
  isPatternProperty?: boolean;
  /** True if this schema is from additionalProperties */
  isAdditionalProperty?: boolean;
}

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

  // Constants for anonymous schema detection
  private static readonly ANONYMOUS_PREFIX = '<anonymous';
  private static readonly ANONYMOUS_MESSAGE_PREFIX = '<anonymous-message';

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
      // Use custom resolver by default to preserve file path metadata
      const defaultResolver = createMetadataPreservingResolver();
      Logger.debug('Created metadata-preserving resolver for AsyncAPI parsing');
      const parserOptions = options?.asyncapi || {
        __unstable: {
          resolver: {
            resolvers: [defaultResolver]
          }
        }
      };

      // If user provided custom resolvers, merge them with our default
      if (options?.asyncapi?.__unstable?.resolver?.resolvers) {
        parserOptions.__unstable = {
          resolver: {
            resolvers: [
              defaultResolver,
              ...options.asyncapi.__unstable.resolver.resolvers
            ]
          }
        };
      }

      const parser = NewParser(3, {
        includeSchemaParsers: true
      });

      let parserResult;
      if (this.isFileInput(input)) {
        const filePath = fileURLToPath(input);
        /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as it just checks file existance */
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exists.');
        }
        // fromFile reads the file, then we parse with options
        const fileResult = fromFile(parser as any, filePath);
        parserResult = await fileResult.parse(parserOptions);
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

    // Build a mapping of schema IDs to component keys for better naming
    const componentSchemaKeys = new Map<string, string>();
    try {
      const allSchemas = doc.schemas();
      for (const schema of allSchemas) {
        const schemaId = schema.id();
        // Extract the component key from the schema ID
        // Schema IDs typically look like: <asyncapi-document-id>/components/schemas/<key>
        if (schemaId?.includes('/components/schemas/')) {
          const parts = schemaId.split('/components/schemas/');
          if (parts.length > 1) {
            const componentKey = parts[1].split('/')[0]; // Get just the key, not nested paths
            componentSchemaKeys.set(schemaId, componentKey);
            Logger.debug(
              `Mapped component schema: ${schemaId} -> ${componentKey}`
            );
          }
        }
      }
    } catch (error) {
      Logger.debug('Could not extract component schema keys:', error);
    }

    // Shared cache for all schema conversions to prevent duplicates
    const globalSchemaCache = new Map<string, AsyncapiV2Schema>();

    // Hash-to-name mapping to detect duplicate schemas with better names
    const schemaHashToName = new Map<string, string>();

    const addToInputModel = (
      payload: AsyncAPISchemaInterface,
      context?: SchemaContext | string
    ) => {
      // Check if this schema is a component schema
      const schemaId = payload.id();
      const componentKey = schemaId
        ? componentSchemaKeys.get(schemaId)
        : undefined;

      // Also check if the schema ID itself is a component key (for resolved refs)
      const isComponentSchema =
        componentKey ||
        (schemaId &&
          Array.from(componentSchemaKeys.values()).includes(schemaId));
      const effectiveComponentKey =
        componentKey || (isComponentSchema ? schemaId : undefined);

      // Merge component key into context if found
      let finalContext: SchemaContext | string | undefined = context;
      if (effectiveComponentKey && typeof context !== 'string') {
        finalContext = {
          ...context,
          componentKey: effectiveComponentKey
        };
      }

      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        payload,
        globalSchemaCache,
        finalContext
      );

      // Skip duplicate detection for boolean schemas
      if (typeof schema === 'boolean') {
        const newMetaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
          schema,
          options
        );
        inputModel.models[newMetaModel.name] = newMetaModel;
        return;
      }

      // Use schema ID as the key for duplicate detection
      // Component schemas and resolved $refs will have stable IDs
      const payloadId = payload.id();
      const existingName = payloadId
        ? schemaHashToName.get(payloadId)
        : undefined;

      // If we've seen this exact schema before (by ID), check if current name is better
      if (
        existingName &&
        existingName !== schema[AsyncAPIInputProcessor.MODELINA_INFERRED_NAME]
      ) {
        const currentName = schema[
          AsyncAPIInputProcessor.MODELINA_INFERRED_NAME
        ] as string;

        // Prefer names without "OneOfOption", "AnyOfOption", "AllOfOption" patterns
        const syntheticPattern = /OneOfOption|AnyOfOption|AllOfOption/;
        const existingIsSynthetic = syntheticPattern.test(existingName);
        const currentIsSynthetic = syntheticPattern.test(currentName);

        if (existingIsSynthetic && !currentIsSynthetic) {
          // Current name is better, update the mapping and use current
          Logger.debug(
            `Replacing synthetic name ${existingName} with better name ${currentName}`
          );
          if (payloadId) {
            schemaHashToName.set(payloadId, currentName);
          }
        } else if (!existingIsSynthetic && currentIsSynthetic) {
          // Existing name is better, skip adding this duplicate
          Logger.debug(
            `Skipping duplicate schema ${currentName}, already have better name ${existingName}`
          );
          return;
        } else if (currentName.length < existingName.length) {
          // Prefer shorter names
          Logger.debug(
            `Replacing longer name ${existingName} with shorter name ${currentName}`
          );
          if (payloadId) {
            schemaHashToName.set(payloadId, currentName);
          }
        } else {
          // Keep existing name, skip this duplicate
          Logger.debug(
            `Skipping duplicate schema ${currentName}, keeping ${existingName}`
          );
          return;
        }
      } else if (!existingName && payloadId) {
        // First time seeing this schema, record its name
        schemaHashToName.set(
          payloadId,
          schema[AsyncAPIInputProcessor.MODELINA_INFERRED_NAME] as string
        );
      }

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
        // Derive a meaningful name from the channel address/path
        const channelAddress = channel.address();
        const channelId = channel.id();

        // Convert channel address to a valid identifier (e.g., "/user/signedup" -> "UserSignedup")
        const deriveChannelName = (address: string): string => {
          return address
            .split('/')
            .filter((part) => part && !part.startsWith('{')) // Remove empty parts and path parameters
            .map((part) => AsyncAPIInputProcessor.capitalize(part))
            .join('');
        };

        const channelName = channelAddress
          ? deriveChannelName(channelAddress)
          : undefined;

        for (const operation of channel.operations()) {
          const handleMessages = (
            messages: MessagesInterface,
            contextChannelName?: string
          ) => {
            // treat multiple messages as oneOf
            if (messages.length > 1) {
              const oneOf: any[] = [];

              for (const message of messages) {
                const payload = message.payload();

                if (!payload) {
                  continue;
                }

                // Add each individual message payload as a separate model
                const messageId = message.id();
                // Use message ID if available, otherwise use channel name
                const contextId =
                  messageId &&
                  !messageId.includes(
                    AsyncAPIInputProcessor.ANONYMOUS_MESSAGE_PREFIX
                  )
                    ? messageId
                    : contextChannelName;
                const messageContext: SchemaContext = contextId
                  ? { messageId: contextId }
                  : {};
                addToInputModel(payload, messageContext);
                oneOf.push(payload.json());
              }

              const payload = new AsyncAPISchema(
                {
                  $id: channelId,
                  oneOf
                },
                channel.meta()
              );

              addToInputModel(payload);
            } else if (messages.length === 1) {
              const message = messages[0];
              const payload = message.payload();
              if (payload) {
                // Use message ID as context for better naming
                const messageId = message.id();
                // Use message ID if available, otherwise use channel name
                const contextId =
                  messageId &&
                  !messageId.includes(
                    AsyncAPIInputProcessor.ANONYMOUS_MESSAGE_PREFIX
                  )
                    ? messageId
                    : contextChannelName;
                const messageContext: SchemaContext = contextId
                  ? { messageId: contextId }
                  : {};
                addToInputModel(payload, messageContext);
              }
            }
          };
          const replyOperation = operation.reply();
          if (replyOperation !== undefined) {
            const replyMessages = replyOperation.messages();
            if (replyMessages.length > 0) {
              handleMessages(replyMessages, channelName);
            } else {
              const replyChannelMessages = replyOperation.channel()?.messages();
              if (replyChannelMessages) {
                handleMessages(replyChannelMessages, channelName);
              }
            }
          }
          handleMessages(operation.messages(), channelName);
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
   * Helper method to capitalize first letter of a string
   */
  private static capitalize(str: string): string {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate a hash of a schema's JSON representation for duplicate detection
   */
  private static hashSchema(schemaJson: any): string {
    if (!schemaJson || typeof schemaJson !== 'object') {
      return '';
    }
    // Create a stable string representation by sorting keys
    const sortedJson = JSON.stringify(
      schemaJson,
      Object.keys(schemaJson).sort()
    );
    // Simple hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < sortedJson.length; i++) {
      hash = (hash << 5) + hash + (sortedJson.codePointAt(i) ?? Number.NaN);
    }
    return hash.toString(36);
  }

  /**
   * Determine the best name for a schema based on available metadata and context.
   *
   * Priority order:
   * 0. User-provided x-modelgen-inferred-name extension (highest priority)
   * 1. Component schema key (from components/schemas)
   * 2. Schema ID (if looks like component name)
   * 3. Schema title field
   * 4. Source file name (from custom resolver metadata)
   * 5. Message ID (for payloads)
   * 6. Context-based inference (property name, array item, enum)
   * 7. Inferred name parameter
   * 8. Fallback to sanitized anonymous ID
   *
   * @param schemaId The schema ID from AsyncAPI parser
   * @param schemaJson The JSON representation of the schema
   * @param context Additional context for name inference
   * @param inferredName Legacy inferred name parameter
   * @returns The determined schema name
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static determineSchemaName(
    schemaId: string | undefined,
    schemaJson: any,
    context?: SchemaContext,
    inferredName?: string
  ): string {
    // Priority 0: User-provided x-modelgen-inferred-name extension (highest priority)
    const existingInferredName = schemaJson?.[this.MODELINA_INFERRED_NAME];
    if (existingInferredName && typeof existingInferredName === 'string') {
      Logger.debug(
        `Using user-provided x-modelgen-inferred-name: ${existingInferredName}`
      );
      return existingInferredName;
    }

    // Priority 1: Component schema key from context
    if (context?.componentKey) {
      Logger.debug(`Using component key from context: ${context.componentKey}`);
      return context.componentKey;
    }

    // Priority 1b: Check if schema ID itself is a component schema name
    // (for resolved $refs that have simple IDs like "Order", "Customer", etc.)
    if (
      schemaId &&
      !schemaId.includes(AsyncAPIInputProcessor.ANONYMOUS_PREFIX) &&
      !schemaId.includes('/') &&
      schemaId.length > 0 &&
      schemaId.startsWith(schemaId[0].toUpperCase())
    ) {
      // Looks like a component schema name (starts with uppercase, no slashes, not anonymous)
      Logger.debug(`Using schema ID as component name: ${schemaId}`);
      return schemaId;
    }

    // Priority 2: Schema title (if not anonymous)
    if (
      schemaJson?.title &&
      typeof schemaJson.title === 'string' &&
      !schemaJson.title.includes('anonymous')
    ) {
      Logger.debug(`Using schema title: ${schemaJson.title}`);
      return schemaJson.title;
    }

    // Priority 3: Source file name (from custom resolver)
    const sourceFile = schemaJson?.['x-modelgen-source-file'];
    if (sourceFile && typeof sourceFile === 'string') {
      Logger.debug(`Using source file name: ${sourceFile}`);
      return sourceFile;
    }

    // Priority 4: Message ID (only for top-level anonymous payloads)
    // This should only apply to inline message payloads, not nested schemas
    if (
      context?.messageId &&
      schemaId &&
      schemaId.includes(AsyncAPIInputProcessor.ANONYMOUS_PREFIX) &&
      !context.propertyName &&
      !context.parentName &&
      !context.isArrayItem &&
      !context.messageId.includes(
        AsyncAPIInputProcessor.ANONYMOUS_MESSAGE_PREFIX
      )
    ) {
      const name = `${context.messageId}Payload`;
      Logger.debug(`Using message ID for inline payload: ${name}`);
      return name;
    }

    // Priority 5: Context-based inference
    if (context) {
      // Enum naming: ParentPropertyEnum
      if (schemaJson?.enum && context.propertyName) {
        const propName = this.capitalize(context.propertyName);
        const name = context.parentName
          ? `${context.parentName}${propName}Enum`
          : `${propName}Enum`;
        Logger.debug(`Using enum name: ${name}`);
        return name;
      }

      // Array item naming: ParentItem
      if (context.isArrayItem && context.parentName) {
        const name = `${context.parentName}Item`;
        Logger.debug(`Using array item name: ${name}`);
        return name;
      }

      // Pattern property naming
      if (context.isPatternProperty && context.parentName) {
        const name = `${context.parentName}PatternProperty`;
        Logger.debug(`Using pattern property name: ${name}`);
        return name;
      }

      // Additional property naming
      if (context.isAdditionalProperty && context.parentName) {
        const name = `${context.parentName}AdditionalProperty`;
        Logger.debug(`Using additional property name: ${name}`);
        return name;
      }

      // Property-based naming: ParentProperty
      if (context.propertyName && context.parentName) {
        const propName = this.capitalize(context.propertyName);
        const name = `${context.parentName}${propName}`;
        Logger.debug(`Using property-based name: ${name}`);
        return name;
      }

      // Just property name if no parent
      if (context.propertyName) {
        const name = this.capitalize(context.propertyName);
        Logger.debug(`Using property name: ${name}`);
        return name;
      }
    }

    // Priority 6: Legacy inferred name parameter
    if (
      inferredName &&
      !inferredName.includes(AsyncAPIInputProcessor.ANONYMOUS_MESSAGE_PREFIX)
    ) {
      Logger.debug(`Using inferred name parameter: ${inferredName}`);
      return inferredName;
    }

    // Priority 7: Fallback to sanitized anonymous ID
    if (schemaId?.includes(AsyncAPIInputProcessor.ANONYMOUS_PREFIX)) {
      const sanitized = schemaId
        .replace('<', '')
        .replace(/-/g, '_')
        .replace('>', '');
      Logger.debug(`Using sanitized anonymous ID: ${sanitized}`);
      return sanitized;
    }

    // Last resort
    return schemaId || 'UnknownSchema';
  }

  /**
   *
   * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension.
   *
   * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
   *
   * @param schema to reflect name for
   * @param alreadyIteratedSchemas map of already processed schemas
   * @param context context information for name inference
   * @param inferredName optional name to use instead of the schema id (legacy parameter)
   */
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static convertToInternalSchema(
    schema: AsyncAPISchemaInterface | boolean,
    alreadyIteratedSchemas: Map<string, AsyncapiV2Schema> = new Map(),
    context?: SchemaContext | string
  ): AsyncapiV2Schema | boolean {
    if (typeof schema === 'boolean') {
      return schema;
    }

    // Handle legacy string parameter (inferredName) for backwards compatibility
    const schemaContext: SchemaContext | undefined =
      typeof context === 'string' ? undefined : context;
    const inferredName: string | undefined =
      typeof context === 'string' ? context : undefined;

    const schemaId = schema.id();
    const schemaJson = schema.json();

    // Use the new determineSchemaName helper
    const schemaUid = this.determineSchemaName(
      schemaId,
      schemaJson,
      schemaContext,
      inferredName
    );

    // Cache by schema ID (not inferred name) to avoid collisions when different schemas have the same name
    const cacheKey = schemaId || schemaUid;
    if (alreadyIteratedSchemas.has(cacheKey)) {
      return alreadyIteratedSchemas.get(cacheKey) as AsyncapiV2Schema;
    }

    const convertedSchema = AsyncapiV2Schema.toSchema(
      schemaJson as Record<string, unknown>
    );
    convertedSchema[this.MODELINA_INFERRED_NAME] = schemaUid;
    alreadyIteratedSchemas.set(cacheKey, convertedSchema);

    if (schema.allOf()) {
      convertedSchema.allOf = schema
        .allOf()!
        .map((item: any, index: number) => {
          // Pass parent context for allOf items
          const allOfContext: SchemaContext = {
            parentName: schemaUid,
            propertyName: `AllOfOption${index}`
          };
          return this.convertToInternalSchema(
            item,
            alreadyIteratedSchemas,
            allOfContext
          );
        });
    }
    if (schema.oneOf()) {
      convertedSchema.oneOf = schema
        .oneOf()!
        .map((item: any, index: number) => {
          // Pass parent context for oneOf items
          const oneOfContext: SchemaContext = {
            parentName: schemaUid,
            propertyName: `OneOfOption${index}`
          };
          return this.convertToInternalSchema(
            item,
            alreadyIteratedSchemas,
            oneOfContext
          );
        });
    }
    if (schema.anyOf()) {
      convertedSchema.anyOf = schema
        .anyOf()!
        .map((item: any, index: number) => {
          // Pass parent context for anyOf items
          const anyOfContext: SchemaContext = {
            parentName: schemaUid,
            propertyName: `AnyOfOption${index}`
          };
          return this.convertToInternalSchema(
            item,
            alreadyIteratedSchemas,
            anyOfContext
          );
        });
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
      // Pass context for additional property naming
      const additionalPropContext: SchemaContext = {
        isAdditionalProperty: true,
        parentName: schemaUid
      };
      convertedSchema.additionalProperties = this.convertToInternalSchema(
        schema.additionalProperties(),
        alreadyIteratedSchemas,
        additionalPropContext
      );
    }
    if (schema.items()) {
      if (Array.isArray(schema.items())) {
        convertedSchema.items = (
          schema.items() as AsyncAPISchemaInterface[]
        ).map((item) => {
          // Pass context for array item naming
          const itemContext: SchemaContext = {
            isArrayItem: true,
            parentName: schemaUid
          };
          return this.convertToInternalSchema(
            item,
            alreadyIteratedSchemas,
            itemContext
          );
        });
      } else {
        // Pass context for array item naming
        const itemContext: SchemaContext = {
          isArrayItem: true,
          parentName: schemaUid
        };
        convertedSchema.items = this.convertToInternalSchema(
          schema.items() as AsyncAPISchemaInterface,
          alreadyIteratedSchemas,
          itemContext
        );
      }
    }

    const schemaProperties = schema.properties();
    if (schemaProperties && Object.keys(schemaProperties).length) {
      const properties: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [propertyName, propertySchema] of Object.entries(
        schemaProperties
      )) {
        // Pass context for property naming
        const propertyContext: SchemaContext = {
          propertyName: String(propertyName),
          parentName: schemaUid
        };
        properties[String(propertyName)] = this.convertToInternalSchema(
          propertySchema,
          alreadyIteratedSchemas,
          propertyContext
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
          const depContext: SchemaContext = {
            ...schemaContext,
            propertyName: AsyncAPIInputProcessor.capitalize(
              String(dependencyName)
            ),
            parentName: schemaUid
          };
          dependencies[String(dependencyName)] = this.convertToInternalSchema(
            dependency,
            alreadyIteratedSchemas,
            depContext
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
        // Pass context for pattern property naming
        const patternContext: SchemaContext = {
          isPatternProperty: true,
          parentName: schemaUid,
          propertyName: String(patternPropertyName)
        };
        patternProperties[String(patternPropertyName)] =
          this.convertToInternalSchema(
            patternProperty,
            alreadyIteratedSchemas,
            patternContext
          );
      }
      convertedSchema.patternProperties = patternProperties;
    }

    const schemaDefinitions = schema.definitions();
    if (schemaDefinitions && Object.keys(schemaDefinitions).length) {
      const definitions: { [key: string]: AsyncapiV2Schema | boolean } = {};
      for (const [definitionName, definition] of Object.entries(
        schemaDefinitions
      )) {
        const defContext: SchemaContext = {
          ...schemaContext,
          propertyName: AsyncAPIInputProcessor.capitalize(
            String(definitionName)
          ),
          parentName: schemaUid
        };
        definitions[String(definitionName)] = this.convertToInternalSchema(
          definition,
          alreadyIteratedSchemas,
          defContext
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
