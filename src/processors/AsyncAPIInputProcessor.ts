import {parse, AsyncAPIDocument} from '@asyncapi/parser';

import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';

export class AsyncAPIInputProcessor extends AbstractInputProcessor {
  /**
     * Process the input as an AsyncAPI document
     * 
     * @param input 
     */
  async process(input: any): Promise<CommonInputModel> {
    if (!this.shouldProcess(input)) throw new Error('Input is not an AsyncAPI document so it cannot be processed.');
    let doc: AsyncAPIDocument;
    const common = new CommonInputModel();
    if (!AsyncAPIInputProcessor.isFromParser(input)) {
      doc = await parse(input);
    } else {
      doc = input;
    }
    common.originalInput= doc;
    doc.allMessages().forEach((message) => {
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(message.payload().json());
      common.models = {...common.models, ...commonModels};
    });
    return common;
  }

  /**
     * Figures out if an object is of type AsyncAPI document
     * 
     * @param input 
     */
  shouldProcess(input: any) : boolean {
    //Check if we got a parsed document from out parser
    //Check if we just got provided a pure object
    if (typeof input === 'object' && (AsyncAPIInputProcessor.isFromParser(input) || input.asyncapi !== undefined)) {
      return true;
    }
    return false;
  }

  /**
     * Figure out if input is from our parser.
     * 
     * @param input 
     */
  static isFromParser(input: any) {
    if (input._json !== undefined && 
            input._json.asyncapi !== undefined && 
            typeof input.version === 'function') {
      return true;
    }
    return false;
  }
}
