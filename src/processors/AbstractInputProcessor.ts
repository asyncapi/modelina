import { ProcessorOption, CommonInputModel } from '../models';
export abstract class AbstractInputProcessor {
  public static MODELGEN_INFFERED_NAME = 'x-modelgen-inferred-name';
  abstract process(input: Record<string, any>, options?: ProcessorOption): Promise<CommonInputModel>;
  abstract shouldProcess(input: Record<string, any>): boolean;
}
