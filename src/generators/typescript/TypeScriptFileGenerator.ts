import { TypeScriptGenerator, TypeScriptRenderCompleteModelOptions } from './';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers } from '../../helpers';

export class TypeScriptFileGenerator extends TypeScriptGenerator implements AbstractFileGenerator<TypeScriptRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
   * @param ensureFilesWritten veryify that the files is completely written before returning, this can happen if the file system is swamped with write requests. 
   */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options?: TypeScriptRenderCompleteModelOptions, ensureFilesWritten = false): Promise<OutputModel[]> {
    let generatedModels = await this.generateCompleteModels(input, options || {});
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== ''; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.ts`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath, ensureFilesWritten);
    }
    return generatedModels;
  }
}
