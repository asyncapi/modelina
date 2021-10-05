import { CommonInputModel, OutputModel } from '../models';

export type FileGenerator = (content: string, toFile: string) => Promise<void>; 

/**
 * Abstract generator which must be implemented by each language
 */
export interface AbstractFileGenerator<RenderFullOptions> {
  generateToSeparateFiles(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: RenderFullOptions): Promise<OutputModel[]>;
}
