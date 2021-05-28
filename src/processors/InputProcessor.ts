import { AbstractInputProcessor } from './AbstractInputProcessor';
import { AsyncAPIInputProcessor } from './AsyncAPIInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel } from '../models/CommonInputModel';

/**
 * Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.
 */
export class InputProcessor {
  public static processor: InputProcessor = new InputProcessor();
  private processors: Map<string, AbstractInputProcessor> = new Map();

  constructor() {
    this.setProcessor('asyncapi', new AsyncAPIInputProcessor()); 
    this.setProcessor('default', new JsonSchemaInputProcessor());
  }
  
  /**
   * Set a processor.
   * 
   * @param type of processor
   * @param processor
   */
  setProcessor(type: string, processor: AbstractInputProcessor): void {
    this.processors.set(type, processor);
  }

  /**
   * 
   * @returns all processors
   */
  getProcessors() : Map<string, AbstractInputProcessor> {
    return this.processors;
  }

  /**
   * The processor code which delegates the processing to the correct implementation.
   * 
   * @param input to process
   * @param type of processor to use
   */
  process(input: Record<string, any>): Promise<CommonInputModel> {
    for (const [type, processor] of this.processors) {
      if (type === 'default') {continue;}
      if (processor.shouldProcess(input)) {
        return processor.process(input);
      }
    }
    const defaultProcessor = this.processors.get('default');
    if (defaultProcessor !== undefined) {
      return defaultProcessor.process(input);
    }
    return Promise.reject(new Error('No default processor found'));
  }
}

