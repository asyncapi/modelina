import { AbstractInputProcessor } from './AbstractInputProcessor';
import { dereference } from '@apidevtools/json-schema-ref-parser';
import path from 'path';
import {
  CommonModel,
  InputMetaModel,
  Draft4Schema,
  Draft7Schema,
  Draft6Schema,
  SwaggerV2Schema,
  OpenapiV3Schema,
  AsyncapiV2Schema,
  ProcessorOptions,
  MetaModel
} from '../models';
import { Logger } from '../utils';
import { Interpreter, InterpreterOptions } from '../interpreter/Interpreter';
import { convertToMetaModel } from '../helpers';
import { ParserOptions } from '@apidevtools/json-schema-ref-parser/dist/lib/options';
export interface JsonSchemaProcessorOptions extends InterpreterOptions {
  /**
   * This option enables that a single enum value `{enum: ['test']}` is interpreted the same as if the value was `{const: 'test'}`
   * Use this option to reduce the number of enums being created and use constant values instead.
   */
  interpretSingleEnumAsConst?: boolean;

  /**
   * This option changes which property name that should be used to represent `additionalProperties` in JSON Schema
   */
  propertyNameForAdditionalProperties?: string;
}

export const defaultJsonSchemaProcessorOptions: JsonSchemaProcessorOptions = {
  allowInheritance: false,
  disableCache: false,
  ignoreAdditionalItems: false,
  ignoreAdditionalProperties: false,
  interpretSingleEnumAsConst: false,
  propertyNameForAdditionalProperties: 'additionalProperties'
};

/**
 * Class for processing JSON Schema
 */
export class JsonSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function for processing a JSON Schema input.
   *
   * @param input
   */
  process(input: any, options?: ProcessorOptions): Promise<InputMetaModel> {
    if (this.shouldProcess(input)) {
      switch (input.$schema) {
        case 'http://json-schema.org/draft-04/schema':
        case 'http://json-schema.org/draft-04/schema#':
          return this.processDraft4(input, options);
        case 'http://json-schema.org/draft-06/schema':
        case 'http://json-schema.org/draft-06/schema#':
          return this.processDraft6(input, options);
        case 'http://json-schema.org/draft-07/schema#':
        case 'http://json-schema.org/draft-07/schema':
        default:
          return this.processDraft7(input, options);
      }
    }
    return Promise.reject(
      new Error('Input is not a JSON Schema, so it cannot be processed.')
    );
  }

  /**
   * Unless the schema states one that is not supported we assume its of type JSON Schema
   *
   * @param input
   */
  shouldProcess(input: any): boolean {
    if (input.$schema !== undefined) {
      if (
        input.$schema === 'http://json-schema.org/draft-04/schema#' ||
        input.$schema === 'http://json-schema.org/draft-04/schema' ||
        input.$schema === 'http://json-schema.org/draft-06/schema#' ||
        input.$schema === 'http://json-schema.org/draft-06/schema' ||
        input.$schema === 'http://json-schema.org/draft-07/schema#' ||
        input.$schema === 'http://json-schema.org/draft-07/schema'
      ) {
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Process a draft-7 schema
   *
   * @param input to process as draft 7
   */
  private async processDraft7(
    input: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    Logger.debug('Processing input as a JSON Schema Draft 7 document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(
      input,
      {},
      new Set(),
      'root',
      true
    );
    input = await this.dereferenceInputs(input);
    const parsedSchema = Draft7Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
      parsedSchema,
      options
    );
    inputModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 7 document');
    return inputModel;
  }

  /**
   * Process a draft-4 schema
   *
   * @param input to process as draft 4
   */
  private async processDraft4(
    input: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    Logger.debug('Processing input as JSON Schema Draft 4 document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(
      input,
      {},
      new Set(),
      'root',
      true
    );
    input = await this.dereferenceInputs(input);
    const parsedSchema = Draft4Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
      parsedSchema,
      options
    );
    inputModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 4 document');
    return inputModel;
  }

  /**
   * Process a draft-6 schema
   *
   * @param input to process as draft-6
   */
  private async processDraft6(
    input: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    Logger.debug('Processing input as a JSON Schema Draft 6 document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    input = JsonSchemaInputProcessor.reflectSchemaNames(
      input,
      {},
      new Set(),
      'root',
      true
    );
    input = await this.dereferenceInputs(input);
    const parsedSchema = Draft6Schema.toSchema(input);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
      parsedSchema,
      options
    );
    inputModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as JSON Schema draft 6 document');
    return inputModel;
  }

  /**
   * This is a hotfix and really only a partial solution as it does not cover all cases.
   *
   * But it's the best we can do until we find or build a better library to handle references.
   */
  public handleRootReference(input: any): any {
    //Because of https://github.com/APIDevTools/json-schema-ref-parser/issues/201 the tool cannot handle root references.
    //This really is a bad patch to fix an underlying problem, but until a full library is available, this is best we can do.
    const hasRootRef = input.$ref !== undefined;
    if (hasRootRef) {
      Logger.warn(
        'Found a root $ref, which is not fully supported in Modelina, trying to do what I can with it...'
      );
      //When we encounter it, manually try to resolve the reference in the definitions section
      const hasDefinitionSection = input.definitions !== undefined;
      if (hasDefinitionSection) {
        const definitionLink = '#/definitions/';
        const referenceLink = input.$ref.slice(0, definitionLink.length);
        const referenceIsLocal = referenceLink === definitionLink;
        if (referenceIsLocal) {
          const definitionName = input.$ref.slice(definitionLink.length);
          const definition = input.definitions[String(definitionName)];
          const definitionExist = definition !== undefined;
          if (definitionExist) {
            delete input.$ref;
            return { ...definition, ...input };
          }
        }
      }
      //All other unhandled cases, means we cannot handle this input
      throw new Error(
        'Cannot handle input, because it has a root `$ref`, please manually resolve the first reference.'
      );
    }
    return input;
  }

  public async dereferenceInputs(input: any): Promise<any> {
    input = this.handleRootReference(input);
    Logger.debug('Dereferencing all $ref instances');
    // eslint-disable-next-line no-undef
    const localPath = `${process.cwd()}${path.sep}`;
    const deRefOption: ParserOptions = {
      continueOnError: true,
      dereference: {
        circular: true,
        excludedPathMatcher: (path: string) => {
          // References inside examples should not be de-referenced, unless they are a property.
          return (
            path.includes('/examples/') &&
            !path.includes('/properties/examples/')
          );
        }
      }
    };
    Logger.debug(
      `Trying to dereference all $ref instances from input, using option ${JSON.stringify(
        deRefOption
      )}.`
    );
    try {
      await dereference(localPath, input, deRefOption);
    } catch (e: any) {
      const errorMessage = `Could not dereference $ref in input, is all the references correct? ${e.message}`;
      Logger.error(errorMessage, e);
      throw new Error(errorMessage);
    }
    Logger.debug(
      'Successfully dereferenced all $ref instances from input.',
      input
    );
    return input;
  }

  /**
   * Each schema must have a name, so when later interpreted, the model have the most accurate model name.
   *
   * Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.
   *
   * This reflects all the common keywords that are shared between draft-4, draft-7 and Swagger 2.0 Schema
   *
   * @param schema to process
   * @param namesStack is a aggregator of previous used names
   * @param seenSchemas is a set of schema already seen and named
   * @param name to infer
   * @param isRoot indicates if performed schema is a root schema
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static reflectSchemaNames(
    schema:
      | Draft4Schema
      | Draft6Schema
      | Draft7Schema
      | SwaggerV2Schema
      | OpenapiV3Schema
      | boolean,
    namesStack: Record<string, number>,
    seenSchemas: Set<
      | Draft4Schema
      | Draft6Schema
      | Draft7Schema
      | SwaggerV2Schema
      | OpenapiV3Schema
    >,
    name?: string,
    isRoot?: boolean
  ): any {
    if (typeof schema === 'boolean') {
      return schema;
    }

    // short-circuit circular references
    if (seenSchemas.has(schema)) {
      return schema;
    }
    seenSchemas.add(schema);

    schema = { ...schema };

    if (isRoot) {
      namesStack[String(name)] = 0;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = name;
      name = '';
    } else if (
      name &&
      !(schema as any)[this.MODELGEN_INFFERED_NAME] &&
      schema.$ref === undefined
    ) {
      let occurrence = namesStack[String(name)];
      if (occurrence === undefined) {
        namesStack[String(name)] = 0;
      } else {
        occurrence++;
      }
      const inferredName = occurrence ? `${name}_${occurrence}` : name;
      (schema as any)[this.MODELGEN_INFFERED_NAME] = inferredName;
    }

    if (schema.allOf !== undefined) {
      schema.allOf = (schema.allOf as any[]).map((item: any, idx: number) =>
        this.reflectSchemaNames(
          item,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'allOf', idx)
        )
      );
    }
    if (schema.oneOf !== undefined) {
      schema.oneOf = (schema.oneOf as any[]).map((item: any, idx: number) =>
        this.reflectSchemaNames(
          item,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'oneOf', idx)
        )
      );
    }
    if (schema.anyOf !== undefined) {
      schema.anyOf = (schema.anyOf as any[]).map((item: any, idx: number) =>
        this.reflectSchemaNames(
          item,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'anyOf', idx)
        )
      );
    }
    if (schema.not !== undefined) {
      schema.not = this.reflectSchemaNames(
        schema.not,
        namesStack,
        seenSchemas,
        this.ensureNamePattern(name, 'not')
      );
    }
    if (
      typeof schema.additionalItems === 'object' &&
      schema.additionalItems !== undefined
    ) {
      schema.additionalItems = this.reflectSchemaNames(
        schema.additionalItems,
        namesStack,
        seenSchemas,
        this.ensureNamePattern(name, 'additionalItem')
      );
    }
    if (
      typeof schema.additionalProperties === 'object' &&
      schema.additionalProperties !== undefined
    ) {
      schema.additionalProperties = this.reflectSchemaNames(
        schema.additionalProperties,
        namesStack,
        seenSchemas,
        this.ensureNamePattern(name, 'additionalProperty')
      );
    }
    if (schema.items !== undefined) {
      if (Array.isArray(schema.items)) {
        schema.items = (schema.items as any[]).map(
          (item: Draft7Schema | boolean, idx: number) =>
            this.reflectSchemaNames(
              item,
              namesStack,
              seenSchemas,
              this.ensureNamePattern(name, 'item', idx)
            )
        );
      } else {
        schema.items = this.reflectSchemaNames(
          schema.items,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'item')
        );
      }
    }

    if (schema.properties !== undefined) {
      const properties: any = {};
      for (const [propertyName, propertySchema] of Object.entries(
        schema.properties
      )) {
        properties[String(propertyName)] = this.reflectSchemaNames(
          propertySchema,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, propertyName)
        );
      }
      schema.properties = properties;
    }
    if (schema.dependencies !== undefined) {
      const dependencies: any = {};
      for (const [dependencyName, dependency] of Object.entries(
        schema.dependencies
      )) {
        if (typeof dependency === 'object' && !Array.isArray(dependency)) {
          dependencies[String(dependencyName)] = this.reflectSchemaNames(
            dependency as any,
            namesStack,
            seenSchemas,
            this.ensureNamePattern(name, dependencyName)
          );
        } else {
          dependencies[String(dependencyName)] = dependency as string[];
        }
      }
      schema.dependencies = dependencies;
    }
    if (schema.patternProperties !== undefined) {
      const patternProperties: any = {};
      for (const [
        idx,
        [patternPropertyName, patternProperty]
      ] of Object.entries(Object.entries(schema.patternProperties))) {
        patternProperties[String(patternPropertyName)] =
          this.reflectSchemaNames(
            patternProperty as any,
            namesStack,
            seenSchemas,
            this.ensureNamePattern(name, 'pattern_property', idx)
          );
      }
      schema.patternProperties = patternProperties;
    }
    if (schema.definitions !== undefined) {
      const definitions: { [key: string]: any } = {};
      for (const [definitionName, definition] of Object.entries(
        schema.definitions
      )) {
        definitions[String(definitionName)] = this.reflectSchemaNames(
          definition,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, definitionName)
        );
      }
      schema.definitions = definitions;
    }

    if (!(schema instanceof Draft4Schema)) {
      //Keywords introduced in draft 6
      if (schema.contains !== undefined) {
        schema.contains = this.reflectSchemaNames(
          schema.contains,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'contain')
        );
      }
      if (schema.propertyNames !== undefined) {
        schema.propertyNames = this.reflectSchemaNames(
          schema.propertyNames,
          namesStack,
          seenSchemas,
          this.ensureNamePattern(name, 'propertyName')
        );
      }
      if (!(schema instanceof Draft6Schema)) {
        //Keywords introduced in Draft 7
        if (schema.if !== undefined) {
          schema.if = this.reflectSchemaNames(
            schema.if,
            namesStack,
            seenSchemas,
            this.ensureNamePattern(name, 'if')
          );
        }
        if (schema.then !== undefined) {
          schema.then = this.reflectSchemaNames(
            schema.then,
            namesStack,
            seenSchemas,
            this.ensureNamePattern(name, 'then')
          );
        }
        if (schema.else !== undefined) {
          schema.else = this.reflectSchemaNames(
            schema.else,
            namesStack,
            seenSchemas,
            this.ensureNamePattern(name, 'else')
          );
        }
      }
    }
    return schema;
  }

  /**
   * Ensure schema name using previous name and new part
   *
   * @param previousName to concatenate with
   * @param newParts
   */
  private static ensureNamePattern(
    previousName: string | undefined,
    ...newParts: any[]
  ): string {
    const pattern = newParts.map((part) => `${part}`).join('_');
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
  static convertSchemaToCommonModel(
    schema:
      | Draft4Schema
      | Draft6Schema
      | Draft7Schema
      | SwaggerV2Schema
      | OpenapiV3Schema
      | AsyncapiV2Schema
      | boolean,
    options?: ProcessorOptions
  ): CommonModel {
    const interpreter = new Interpreter();
    const model = interpreter.interpret(
      schema,
      options?.jsonSchema ?? options?.interpreter
    );
    if (model === undefined) {
      throw new Error('Could not interpret schema to internal model');
    }
    return model;
  }

  /**
   * Simplifies a JSON Schema into a common models
   *
   * @param schema to simplify to common model
   */
  static convertSchemaToMetaModel(
    schema:
      | Draft4Schema
      | Draft6Schema
      | Draft7Schema
      | SwaggerV2Schema
      | OpenapiV3Schema
      | AsyncapiV2Schema
      | boolean,
    options?: ProcessorOptions
  ): MetaModel {
    const commonModel = this.convertSchemaToCommonModel(schema, options);
    return convertToMetaModel({
      jsonSchemaModel: commonModel,
      options: { ...defaultJsonSchemaProcessorOptions, ...options?.jsonSchema },
      alreadySeenModels: new Map()
    });
  }
}
