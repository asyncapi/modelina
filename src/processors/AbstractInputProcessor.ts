import { CommonInputModel } from "../models/CommonInputModel";

export abstract class AbstractInputProcessor {
  // Process content
  abstract process(input: any): Promise<CommonInputModel>;
  abstract shouldProcess(input: any): boolean;
}
