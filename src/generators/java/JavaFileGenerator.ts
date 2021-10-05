import { JavaGenerator, JavaRenderFullOptions } from './';
import { CommonInputModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';

export class JavaFileGenerator extends JavaGenerator implements AbstractFileGenerator<JavaRenderFullOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   */
  public async generateToSeparateFiles(input: Record<string, unknown> | CommonInputModel, outputDirectory: string, options: JavaRenderFullOptions): Promise<OutputModel[]> {
    let generatedModels = await this.generateFull(input, options);
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== undefined; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.java`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath);
    }
    return generatedModels;
  }
}
