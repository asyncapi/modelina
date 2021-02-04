import { AbstractInputProcessor } from "./AbstractInputProcessor";
import { AsyncAPIInputProcessor } from "./AsyncAPIInputProcessor";
import { JsonSchemaInputProcessor } from "./JsonSchemaInputProcessor";
import { CommonInputModel } from "../models/CommonInputModel";

/**
 * Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.
 */
export class InputProcessor {
  private processors: Map<string, AbstractInputProcessor> = new Map();

  constructor(){
    const asyncAPI = new AsyncAPIInputProcessor();
    this.addProcessor("asyncapi", asyncAPI); 
    const jsonSchema = new JsonSchemaInputProcessor();
    this.addProcessor("default", jsonSchema);
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
   * @param input to process
   * @param type of processor to use
   */
  process(input: any): Promise<CommonInputModel> {
    const nonDefaultProcessors = Object.entries(this.processors).filter(([type]) => {
      return type !== "default";
    });
    for (const [type, processor] of nonDefaultProcessors) {
      if(processor.shouldProcess(input)) {
        return processor.process(input);
      }
    }
    const defaultProcessor = this.processors.get("default");
    if(defaultProcessor !== undefined){
      return defaultProcessor.process(input);
    }
    throw "No default processor found"
  }
}
