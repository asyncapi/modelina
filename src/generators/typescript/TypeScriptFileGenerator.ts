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
   */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options?: TypeScriptRenderCompleteModelOptions): Promise<OutputModel[]> {
    let generatedModels = await this.generateCompleteModels(input, options || {});
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== ''; });
    for (const outputModel of generatedModels) {
      const filePath = path.resolve(outputDirectory, `${outputModel.modelName}.ts`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath);
      if(this.options.renderTests) {
        const testOutputDir = options?.outputTestDirectory || outputDirectory;
        const filePath = path.resolve(testOutputDir, `${outputModel.modelName}.spec.ts`);
        const testCode = outputModel.test_result ? outputModel.test_result : '';
        await FileHelpers.writerToFileSystem(testCode, filePath);
      }
    }
    return generatedModels;
  }
}
