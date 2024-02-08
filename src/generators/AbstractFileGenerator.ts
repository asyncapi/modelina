import { InputMetaModel, OutputModel } from '../models';

export type FileGenerator = (content: string, toFile: string) => Promise<void>;

/**
 * Abstract file generator which each file generator much implement.
 */
export interface AbstractFileGenerator<RenderCompleteModelOptions> {
  generateToFiles(
    input: any | InputMetaModel,
    outputDirectory: string,
    options: RenderCompleteModelOptions
  ): Promise<OutputModel[]>;
}
