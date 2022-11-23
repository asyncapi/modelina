import { InputMetaModel, OutputModel } from '../models';

export type FileGenerator = (content: string, toFile: string) => Promise<void>; 

export interface TypeScriptRenderCompleteModelOptions extends CommonRenderCompleteModelOptions {
  exportType: 'default' | 'named';
}

/**
 * Abstract file generator which each file generator much implement.
 */
export interface AbstractFileGenerator<RenderCompleteModelOptions> {
  generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options: RenderCompleteModelOptions): Promise<OutputModel[]>;
}
