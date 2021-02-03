import { CommonInputModel } from "../models/CommonInputModel";

export abstract class AbstractInputProcessor {
  // Process content
  abstract process(input: any): Promise<CommonInputModel>;
  abstract isForMe(input: any): boolean;
}
