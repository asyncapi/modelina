import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { InputMetaModel, OpenapiV3Schema } from '../models';
import { Logger } from '../utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 } from 'openapi-types';

/**
 * Class for processing OpenAPI V3.0 inputs
 */
export class OpenAPIInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['3.0.0', '3.0.1', '3.0.2', '3.0.3'];

  /**
   * Process the input as a OpenAPI V3.0 document
   * 
   * @param input 
   */
  async process(input: Record<string, any>): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not a OpenAPI document so it cannot be processed.');}

    Logger.debug('Processing input as an OpenAPI document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    const api = (await SwaggerParser.dereference(input as any) as unknown) as OpenAPIV3.Document;

    for (const [path, pathObject] of Object.entries(api.paths)) {
      this.processPath(pathObject, path, inputModel);
    }
    return inputModel;
  }

  private processPath(pathObject: OpenAPIV3.PathItemObject | undefined, path: string, inputModel: InputMetaModel) {
    if (pathObject) {
      //Remove all special chars from path
      let formattedPathName = path.replace(/[^\w\s*]+/g, '');
      //Remove any pre-pending '/'
      formattedPathName = formattedPathName.replace(/\//, '');
      //Replace all segment separators '/'
      formattedPathName = formattedPathName.replace(/\//gm, '_');
      this.processOperation(pathObject.get, `${formattedPathName}_get`, inputModel);
      this.processOperation(pathObject.put, `${formattedPathName}_put`, inputModel);
      this.processOperation(pathObject.post, `${formattedPathName}_post`, inputModel);
      this.processOperation(pathObject.delete, `${formattedPathName}_delete`, inputModel);
      this.processOperation(pathObject.options, `${formattedPathName}_options`, inputModel);
      this.processOperation(pathObject.head, `${formattedPathName}_head`, inputModel);
      this.processOperation(pathObject.patch, `${formattedPathName}_patch`, inputModel);
      this.processOperation(pathObject.trace, `${formattedPathName}_trace`, inputModel);
    } 
  }

  private processOperation(operation: OpenAPIV3.OperationObject | undefined, path: string, inputModel: InputMetaModel) {
    if (operation) {
      this.iterateResponses(operation.responses, path, inputModel);

      if (operation.requestBody) {
        this.iterateMediaType((operation.requestBody as OpenAPIV3.RequestBodyObject).content || {}, path, inputModel);
      }
      
      if (operation.callbacks) {
        for (const [callbackName, callback] of Object.entries(operation.callbacks)) {
          const callbackObject = callback as OpenAPIV3.CallbackObject;
          for (const [callbackPath, callbackPathObject] of Object.entries(callbackObject)) {
            this.processPath(callbackPathObject, `${path}_callback_${callbackName}_${callbackPath}`, inputModel);
          }
        }
      }
    }
  }

  private iterateResponses(responses: OpenAPIV3.ResponsesObject, path: string, inputModel: InputMetaModel) {
    for (const [responseName, response] of Object.entries(responses)) {
      //Replace any '/' with '_'
      const formattedResponseName = responseName.replace(/\//, '_');
      this.iterateMediaType((response as OpenAPIV3.ResponseObject).content || {}, `${path}_${formattedResponseName}`, inputModel);
    }
  }

  private iterateMediaType(mediaTypes: {[media: string]: OpenAPIV3.MediaTypeObject}, path: string, inputModel: InputMetaModel) {
    for (const [mediaContent, mediaTypeObject] of Object.entries(mediaTypes)) {
      const mediaType = mediaTypeObject;
      if (mediaType.schema === undefined) { continue; }
      const mediaTypeSchema = (mediaType.schema as unknown) as OpenAPIV3.SchemaObject;
      //Replace any '/' with '_'
      const formattedMediaContent = mediaContent.replace(/\//, '_');
      this.includeSchema(mediaTypeSchema, `${path}_${formattedMediaContent}`, inputModel);
    }
  }

  private includeSchema(schema: OpenAPIV3.SchemaObject, name: string, inputModel: InputMetaModel) {
    const internalSchema = OpenAPIInputProcessor.convertToInternalSchema(schema, name);
    const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(internalSchema);
    //TODO: should we check if it already exist?
    inputModel.models[metaModel.name] = metaModel;
  }

  /**
   * Converts a schema to the internal schema format.
   * 
   * @param schema to convert
   * @param name of the schema
   */
  static convertToInternalSchema(
    schema: OpenAPIV3.SchemaObject,
    name: string): OpenapiV3Schema {
    let internalSchema = OpenapiV3Schema.toSchema(schema as any);
    internalSchema = JsonSchemaInputProcessor.reflectSchemaNames(internalSchema, {}, name, true);
    return internalSchema;
  }

  /**
	 * Figures out if an object is of type OpenAPI V3.0.x document and supported
	 * 
	 * @param input 
	 */
  shouldProcess(input: Record<string, any>) : boolean {
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {return false;}
    return OpenAPIInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   * 
   * @param input 
   */
  tryGetVersionOfDocument(input: Record<string, any>) : string | undefined {
    return input && input.openapi;
  }
}
