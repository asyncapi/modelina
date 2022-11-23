import { RustGenerator, RustRenderCompleteModelOptions } from './RustGenerator';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers, FormatHelpers } from '../../helpers';
import { DeepPartial, mergePartialAndDefault } from '../../utils';

export class RustFileGenerator extends RustGenerator implements AbstractFileGenerator<RustRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
  */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options?: DeepPartial<RustRenderCompleteModelOptions>): Promise<OutputModel[]> {
    const realizedOptions = mergePartialAndDefault(RustGenerator.defaultCompleteOptions, options) as RustRenderCompleteModelOptions;
    let generatedModels = await this.generateCompleteModels(input, realizedOptions);
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== '' && outputModel.modelName !== undefined; });
    for (const outputModel of generatedModels) {
      const fileName = FormatHelpers.snakeCase(outputModel.modelName);
      const filePath = path.resolve(outputDirectory, `${fileName}.rs`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath, realizedOptions.ensureFilesWritten);
    }
    return generatedModels;
  }

  /**
   * Generates a compile-able package (crate), 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
  */
  public async generateToPackage(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options?: DeepPartial<RustRenderCompleteModelOptions>): Promise<OutputModel[]> {
    const realizedOptions = mergePartialAndDefault(RustGenerator.defaultCompleteOptions, options) as RustRenderCompleteModelOptions;
    // Crate package expects source code to be written to src/<filename>.rs
    const sourceOutputDirectory = `${outputDirectory}/src`;
    let generatedModels = await this.generateToFiles(input, sourceOutputDirectory, options);
    // render lib.rs and Cargo.toml
    if (realizedOptions.supportFiles) {
      const supportOutput = await this.generateCompleteSupport(input, realizedOptions);
      generatedModels = generatedModels.concat(supportOutput);
      for (const outputModel of supportOutput) {
        const filePath = path.resolve(outputDirectory, outputModel.model.name);
        await FileHelpers.writerToFileSystem(outputModel.result, filePath, realizedOptions.ensureFilesWritten);
      }
    }
    return generatedModels;
  }
}
