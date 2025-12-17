import { ProcessorOptions, InputMetaModel } from '../models';

export abstract class AbstractInputProcessor {
  public static MODELINA_INFERRED_NAME = 'x-modelgen-inferred-name';
  abstract process(
    input: any,
    options?: ProcessorOptions
  ): Promise<InputMetaModel>;
  abstract shouldProcess(input: any): boolean;
}
