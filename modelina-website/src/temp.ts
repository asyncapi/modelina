import { InputMetaModel, ProcessorOptions, AbstractInputProcessor } from '@asyncapi/modelina';

/** Class for processing Typescript code inputs to Common module*/
export interface TypeScriptInputProcessorOptions {
  uniqueNames?: boolean;
  required?: boolean;
}
export class TypeScriptInputProcessor extends AbstractInputProcessor {
  shouldProcess(input: any): boolean {
    return false;
  }

  process(input: any, options?: ProcessorOptions): Promise<InputMetaModel> {
    return Promise.reject();
  }
}
