import { CommonInputModel } from '../models/CommonInputModel';

export abstract class AbstractInputProcessor {
  public static MODELGEN_INFFERED_NAME = 'x-modelgen-inferred-name';
  // Process content
  abstract process(input: any): Promise<CommonInputModel>;
  abstract shouldProcess(input: any): boolean;
}
