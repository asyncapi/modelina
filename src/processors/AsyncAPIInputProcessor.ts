import {parse, AsyncAPIDocument, Schema as AsyncAPISchema, ParserOptions} from '@asyncapi/parser';
import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel, ProcessorOptions, Schema } from '../models';
import { Logger } from '../utils';
import { AsyncAPI2_0Schema } from '../models/AsyncAPI2_0Schema';

/**
 * Class for processing AsyncAPI inputs
 */
export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['2.0.0', '2.1.0'];

  /**
   * Process the input as an AsyncAPI document
   * 
   * @param input 
   */
  async process(input: Record<string, any>, options?: ProcessorOptions): Promise<CommonInputModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not an AsyncAPI document so it cannot be processed.');}

    Logger.debug('Processing input as an AsyncAPI document');
    let doc: AsyncAPIDocument;
    const common = new CommonInputModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      doc = await parse(input as any, options?.asyncapi || {} as ParserOptions);
    } else {
      doc = input as AsyncAPIDocument;
    }
    common.originalInput = doc;
    
    for (const [, message] of doc.allMessages()) {
      const schema = AsyncAPI2_0Schema.toSchema(message.payload());
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(schema);
      common.models = {...common.models, ...commonModels};
    }
    return common;
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
   * Figure out if input is from our parser.
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
