import { AbstractInputProcessor } from "./AbstractInputProcessor";
import { AsyncAPIInputProcessor } from "./AsyncAPIInputProcessor";
import { JsonSchemaInputProcessor } from "./JsonSchemaInputProcessor";

import { CommonInputModel } from "../models/CommonInputModel";

/**
 * Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.
 */
export class InputProcessor extends AbstractInputProcessor {
  processors: Map<string, AbstractInputProcessor> = new Map();

  constructor(){
    super();
    const asyncAPI = new AsyncAPIInputProcessor();
    this.addProcessor("asyncapi", asyncAPI); 
    const jsonSchema = new JsonSchemaInputProcessor();
    this.addProcessor("json-schema", jsonSchema);
  }

  /**
   * Add a processor.
   * 
   * @param type of processor
   * @param processor
   */
  addProcessor(type: string, processor: AbstractInputProcessor) {
    this.processors.set(type, processor);
  }

  /**
   * The processor code which delegates the processing to the correct implementation.
   * 
   * @param object to process
   * @param type of processor to use
   */
  process(object: any, type: string = 'json-schema'): Promise<CommonInputModel> {
    const processor = this.processors.get(type);
    if (processor === undefined) {
      throw Error(`Could not find processor '${type}'`);
    }
    return processor.process(object);
  }
}

export const inputProcessor = new InputProcessor();
