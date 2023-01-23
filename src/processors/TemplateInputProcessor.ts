import { AbstractInputProcessor } from './AbstractInputProcessor';
import { InputMetaModel, ProcessorOptions } from '../models';

/**
 * Class for processing X input
 */
export class TemplateInputProcessor extends AbstractInputProcessor {
  shouldProcess(input?: any): boolean {
    if (!input) {
      return false;
    }

    return false;
  }

  async process(
    input?: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      throw new Error(
        'Input is not X and cannot be processed by this input processor.'
      );
    }

    const inputModel = new InputMetaModel();

    // Add processing code here

    return inputModel;
  }
}
