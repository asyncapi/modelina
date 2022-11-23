import { JavaGenerator, JavaRenderCompleteModelOptions } from './';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers'
import { mergePartialAndDefault, DeepPartial } from '../../utils';;

export class JavaFileGenerator extends JavaGenerator implements AbstractFileGenerator<JavaRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options?: DeepPartial<JavaRenderCompleteModelOptions>): Promise<OutputModel[]> {
    const realizedOptions = mergePartialAndDefault(JavaGenerator.defaultCompleteOptions, options) as JavaRenderCompleteModelOptions;
    let generatedModels = await this.generateCompleteModels(input, realizedOptions);
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== ''; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.java`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath, realizedOptions.ensureFilesWritten);
    }
    return generatedModels;
  }
}
