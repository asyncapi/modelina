import { JavaGenerator, JavaRenderCompleteModelOptions } from './';
import { CommonInputModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';
import { isReservedJavaKeyword } from './Constants';

export class JavaFileGenerator extends JavaGenerator implements AbstractFileGenerator<JavaRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   */
  public async generateToFiles(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: JavaRenderCompleteModelOptions): Promise<OutputModel[]> {
    let generatedModels = await this.generateCompleteModels(input, options);
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== undefined; });
    for (const outputModel of generatedModels) {
      const modelOutputFileName = this.options.namingConvention?.type ? this.options.namingConvention.type(outputModel.modelName, {inputModel: outputModel.inputModel, model: outputModel.model, reservedKeywordCallback: isReservedJavaKeyword}) : outputModel.modelName;
      const filePath = path.resolve(outputDirectory, `${modelOutputFileName}.java`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath);
    }
    return generatedModels;
  }
}
