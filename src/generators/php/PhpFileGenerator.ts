import { PhpGenerator, PhpRenderCompleteModelOptions } from '.';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';

export class PhpFileGenerator
  extends PhpGenerator
  implements AbstractFileGenerator<PhpRenderCompleteModelOptions>
{
  /**
   * Generates all the models to an output directory each model with their own separate files.
   *
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   * @param ensureFilesWritten
   */
  public async generateToFiles(
    input: any | InputMetaModel,
    outputDirectory: string,
    options?: PhpRenderCompleteModelOptions,
    ensureFilesWritten = false
  ): Promise<OutputModel[]> {
    let generatedModels: OutputModel[] = await this.generateCompleteModels(
      input,
      options || {}
    );
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => {
      return outputModel.modelName !== '';
    });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(
        outputDirectory,
        `${outputModel.modelName}.php`
      );
      await FileHelpers.writerToFileSystem(
        outputModel.result,
        filePath,
        ensureFilesWritten
      );
    }
    return generatedModels;
  }
}
