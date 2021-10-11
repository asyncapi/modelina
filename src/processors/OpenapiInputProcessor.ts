import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel, OpenapiV3Schema } from '../models';
import { Logger } from '../utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 } from 'openapi-types';

/**
 * Class for processing OpenAPI V3.0.x inputs
 */
export class OpenapiInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['3.0.0', '3.0.1', '3.0.2', '3.0.3'];

  /**
   * Process the input as a OpenAPI V3.0.x document
   * 
   * @param input 
   */
  async process(input: Record<string, any>): Promise<CommonInputModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not a OpenAPI V3.0.x document so it cannot be processed.');}

    Logger.debug('Processing input as a OpenAPI V3.0.x document');
    const inputModel = new CommonInputModel();
    inputModel.originalInput = input;
    const api = await SwaggerParser.dereference(input as any) as OpenAPIV3.Document;

    for (const [path, pathObject] of Object.entries(api.paths)) {
      this.processPath(pathObject, path, inputModel);
    }
    return inputModel;
  }

  private processPath(pathObject: OpenAPIV3.PathItemObject | undefined, path: string, inputModel: CommonInputModel) {
    if (pathObject) {
      //Remove all parameters from path
      let formattedPathName = path.replace(/(\/)?\{(.*)\}/gm, '');
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
  
      this.includeParameters(pathObject.parameters, formattedPathName, inputModel);
  
      if(pathObject.)
    } 
  }

  private processOperation(operation: OpenAPIV3.OperationObject | undefined, path: string, inputModel: CommonInputModel) {
    if (operation) {
      this.includeResponses(operation.responses, path, inputModel);
      this.includeParameters(operation.parameters, path, inputModel);
      
      if(operation.callbacks) {
        const callbacks = operation.callbacks as OpenAPIV3.CallbackObject
      }
      
    }
  }

  private includeResponses(responses: OpenAPIV3.ResponsesObject, path: string, inputModel: CommonInputModel) {
    for (const [responseName, response] of Object.entries(responses)) {
      if (response !== undefined) {
        const contentMediaTypes = (response as OpenAPIV3.ResponseObject).content || {};
        for (const mediaContent of Object.values(contentMediaTypes)) {
          const mediaTypeSchema = (mediaContent as OpenAPIV3.MediaTypeObject).schema;
          if (mediaTypeSchema !== undefined) { 
            const internalOpenapiSchema = OpenapiInputProcessor.convertToInternalSchema((mediaContent as OpenAPIV3.SchemaObject), `${path}_${responseName}`);
            const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(internalOpenapiSchema);
            inputModel.models = {...inputModel.models, ...commonModels};
          }
        }
      }
    }
  }

  private includeParameters(parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] | undefined, path: string, inputModel: CommonInputModel) {
    for (const parameterObject of parameters || []) {
      const parameter = parameterObject as OpenAPIV3.ParameterObject;
      if (parameter.in === 'body') {
        const bodyParameterSchema = parameter.schema as OpenAPIV3.SchemaObject;
        const swaggerSchema = OpenapiInputProcessor.convertToInternalSchema(bodyParameterSchema, `${path}_body`);
        const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(swaggerSchema);
        inputModel.models = {...inputModel.models, ...commonModels};
      }
    }
  }

  /**
   * Converts a schema to the Common schema format.
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
    return OpenapiInputProcessor.supportedVersions.includes(version);
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
