import { CSharpGenerator, CSharpRenderCompleteModelOptions } from './';
import { CommonInputModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';

export class CSharpFileGenerator extends CSharpGenerator implements AbstractFileGenerator<CSharpRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   */
  public async generateToFiles(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: CSharpRenderCompleteModelOptions): Promise<OutputModel[]> {
    let generatedModels = await this.generateCompleteModels(input, options);
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== undefined; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.java`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath);
    }
    return generatedModels;
  }
}
