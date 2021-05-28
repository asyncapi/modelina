import { CommonInputModel } from '../models/CommonInputModel';

export abstract class AbstractInputProcessor {
  public static MODELGEN_INFFERED_NAME = 'x-modelgen-inferred-name';
  abstract process(input: Record<string, any>): Promise<CommonInputModel>;
  abstract shouldProcess(input: Record<string, any>): boolean;
}
