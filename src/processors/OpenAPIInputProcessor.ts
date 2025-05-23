import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { InputMetaModel, OpenapiV3Schema, ProcessorOptions } from '../models';
import { Logger } from '../utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
export interface OpenAPIInputProcessorOptions {
  includeComponentSchemas?: boolean;
}

/**
 * Class for processing OpenAPI inputs
 */
export class OpenAPIInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.1.0'];

  /**
   * Process the input as a OpenAPI document
   *
   * @param input
   */
  async process(
    input: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      throw new Error(
        'Input is not a OpenAPI document so it cannot be processed.'
      );
    }

    Logger.debug('Processing input as an OpenAPI document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    const api = (await SwaggerParser.dereference(input as any)) as unknown as
      | OpenAPIV3.Document
      | OpenAPIV3_1.Document;
    if (api && api.paths) {
      for (const [path, pathObject] of Object.entries(api.paths)) {
        this.processPath(pathObject, path, inputModel, options);
      }
    }
    if (options?.openapi?.includeComponentSchemas) {
      for (const [schemaName, schemaObject] of Object.entries(
        api.components?.schemas ?? {}
      )) {
        if ((schemaObject as any)['$ref'] === undefined) {
          this.includeSchema(
            schemaObject as OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
            schemaName,
            inputModel,
            options
          );
        }
      }
    }
    return inputModel;
  }

  private processPath(
    pathObject:
      | OpenAPIV3.PathItemObject
      | OpenAPIV3_1.PathItemObject
      | undefined,
    path: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    if (pathObject) {
      //Remove all special chars from path
      let formattedPathName = path.replace(/[^\w\s*]+/g, '');
      //Remove any pre-pending '/'
      formattedPathName = formattedPathName.replace(/\//, '');
      //Replace all segment separators '/'
      formattedPathName = formattedPathName.replace(/\//gm, '_');
      this.processOperation(
        pathObject.get,
        `${formattedPathName}_get`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.put,
        `${formattedPathName}_put`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.post,
        `${formattedPathName}_post`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.delete,
        `${formattedPathName}_delete`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.options,
        `${formattedPathName}_options`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.head,
        `${formattedPathName}_head`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.patch,
        `${formattedPathName}_patch`,
        inputModel,
        options
      );
      this.processOperation(
        pathObject.trace,
        `${formattedPathName}_trace`,
        inputModel,
        options
      );
      this.iterateParameters(
        pathObject.parameters,
        `${formattedPathName}_parameters`,
        inputModel,
        options
      );
    }
  }

  private processOperation(
    operation:
      | OpenAPIV3.OperationObject
      | OpenAPIV3_1.OperationObject
      | undefined,
    path: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    if (operation && operation.responses) {
      this.iterateResponses(operation.responses, path, inputModel, options);
      this.iterateParameters(
        operation.parameters,
        `${path}_parameters`,
        inputModel,
        options
      );

      if (operation.requestBody) {
        this.iterateMediaType(
          (
            operation.requestBody as
              | OpenAPIV3.RequestBodyObject
              | OpenAPIV3_1.RequestBodyObject
          ).content || {},
          path,
          inputModel,
          options
        );
      }

      if (operation.callbacks) {
        for (const [callbackName, callback] of Object.entries(
          operation.callbacks
        )) {
          const callbackObject = callback as
            | OpenAPIV3.CallbackObject
            | OpenAPIV3_1.CallbackObject;
          for (const [callbackPath, callbackPathObject] of Object.entries(
            callbackObject
          )) {
            this.processPath(
              callbackPathObject,
              `${path}_callback_${callbackName}_${callbackPath}`,
              inputModel,
              options
            );
          }
        }
      }
    }
  }

  private iterateResponses(
    responses: OpenAPIV3.ResponsesObject | OpenAPIV3_1.ResponsesObject,
    path: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    for (const [responseName, response] of Object.entries(responses)) {
      //Replace any '/' with '_'
      const formattedResponseName = responseName.replace(/\//, '_');
      this.iterateMediaType(
        (response as OpenAPIV3.ResponseObject | OpenAPIV3_1.ResponseObject)
          .content || {},
        `${path}_${formattedResponseName}`,
        inputModel,
        options
      );
    }
  }

  private iterateParameters(
    parameters:
      | (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
      | (OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject)[]
      | undefined,
    path: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    for (const parameterObject of parameters || []) {
      const parameter = parameterObject as OpenAPIV3.ParameterObject;
      if (parameter.schema) {
        this.includeSchema(
          parameter.schema as OpenAPIV3.SchemaObject,
          `${path}_${parameter.in}_${parameter.name}`,
          inputModel,
          options
        );
      }
    }
  }

  private iterateMediaType(
    mediaTypes: {
      [media: string]: OpenAPIV3.MediaTypeObject | OpenAPIV3_1.MediaTypeObject;
    },
    path: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    for (const [mediaContent, mediaTypeObject] of Object.entries(mediaTypes)) {
      const mediaType = mediaTypeObject;
      if (mediaType.schema === undefined) {
        continue;
      }
      const mediaTypeSchema = mediaType.schema as unknown as
        | OpenAPIV3.SchemaObject
        | OpenAPIV3_1.SchemaObject;
      //Replace any '/' with '_'
      const formattedMediaContent = mediaContent.replace(/\//, '_');
      this.includeSchema(
        mediaTypeSchema,
        `${path}_${formattedMediaContent}`,
        inputModel,
        options
      );
    }
  }

  private includeSchema(
    schema: OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
    name: string,
    inputModel: InputMetaModel,
    options?: ProcessorOptions
  ) {
    const internalSchema = OpenAPIInputProcessor.convertToInternalSchema(
      schema,
      name
    );
    const newMetaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(
      internalSchema,
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

  /**
   * Converts a schema to the internal schema format.
   *
   * @param schema to convert
   * @param name of the schema
   */
  static convertToInternalSchema(
    schema: OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
    name: string
  ): OpenapiV3Schema {
    const namedSchema = JsonSchemaInputProcessor.reflectSchemaNames(
      schema,
      {},
      new Set(),
      name,
      true
    );

    return OpenapiV3Schema.toSchema(namedSchema);
  }

  /**
   * Figures out if an object is of type OpenAPI V3.0.x document and supported
   *
   * @param input
   */
  shouldProcess(input: any): boolean {
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {
      return false;
    }
    return OpenAPIInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   *
   * @param input
   */
  tryGetVersionOfDocument(input: any): string | undefined {
    return input && input.openapi;
  }
}
