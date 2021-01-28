import { CommonInputModel } from "../models/CommonInputModel";

export abstract class AbstractInputProcessor {
  // Process content
  abstract process(object: any): Promise<CommonInputModel>;
}
