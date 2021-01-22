import { I_InputProcessor } from "interfaces/I_InputProcessor";
import { CommonInputModel } from "models/CommonInputModel";
import { AsyncAPIInputProcessor } from "processors/AsyncAPIInputProcessor";
import { JsonSchemaInputProcessor } from "processors/JsonSchemaInputProcessor";

/**
 * Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.
 */
export class InputProcessor implements I_InputProcessor {
  asyncAPIProcessor: I_InputProcessor;
  jsonSchemaProcessor: I_InputProcessor;

  constructor(){
    this.asyncAPIProcessor = new AsyncAPIInputProcessor();
    this.jsonSchemaProcessor = new JsonSchemaInputProcessor();
  }

  async process(object: any): Promise<CommonInputModel> {
    if(AsyncAPIInputProcessor.isAsyncAPI(object)){
      return await this.asyncAPIProcessor.process(object);
    } else {
      //Default to processing input as JSON Schema
      return await this.jsonSchemaProcessor.process(object);
    }
  }
}