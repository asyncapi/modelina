import { CommonInputModel } from '../models/CommonInputModel';

export abstract class AbstractInputProcessor {
  public static MODELGEN_INFFERED_NAME = 'x-modelgen-inferred-name';
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  abstract process(input: any): Promise<CommonInputModel>;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  abstract shouldProcess(input: any): boolean;
}
