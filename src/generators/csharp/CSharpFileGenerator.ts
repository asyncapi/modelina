import { CSharpGenerator, CSharpRenderCompleteModelOptions } from './';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';
import { mergePartialAndDefault, DeepPartial } from '../../utils';

export class CSharpFileGenerator extends CSharpGenerator implements AbstractFileGenerator<CSharpRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options: DeepPartial<CSharpRenderCompleteModelOptions>): Promise<OutputModel[]> {
    const realizedOptions = mergePartialAndDefault(CSharpGenerator.defaultCompleteOptions, options) as CSharpRenderCompleteModelOptions;
    let generatedModels = await this.generateCompleteModels(input, realizedOptions);
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== ''; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.cs`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath, realizedOptions.ensureFilesWritten);
    }
    return generatedModels;
  }
}
