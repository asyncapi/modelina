import { RustGenerator, RustRenderCompleteModelOptions } from './RustGenerator';
import { InputMetaModel, OutputModel } from '../../models';
import * as path from 'path';
import { AbstractFileGenerator } from '../AbstractFileGenerator';
import { FileHelpers, FormatHelpers } from '../../helpers';

export class RustFileGenerator extends RustGenerator implements AbstractFileGenerator<RustRenderCompleteModelOptions> {
  /**
   * Generates all the models to an output directory each model with their own separate files. 
   * 
   * @param input
   * @param outputDirectory where you want the models generated to
   * @param options
  */
  public async generateToFiles(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options: RustRenderCompleteModelOptions): Promise<OutputModel[]> {
    let generatedModels = await this.generateCompleteModels(input, options);
    //Filter anything out that have not been successfully generated
    generatedModels = generatedModels.filter((outputModel) => { return outputModel.modelName !== '' && outputModel.modelName !== undefined; });
    for (const outputModel of generatedModels) {
      const fileName = FormatHelpers.snakeCase(outputModel.modelName);
      const filePath = path.resolve(outputDirectory, `${fileName}.rs`);
      await FileHelpers.writerToFileSystem(outputModel.result, filePath);
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
  public async generateToPackage(input: Record<string, unknown> | InputMetaModel, outputDirectory: string, options: RustRenderCompleteModelOptions): Promise<OutputModel[]> {
    // Crate package expects source code to be written to src/<filename>.rs
    const sourceOutputDirectory = `${outputDirectory}/src`;
    let generatedModels = await this.generateToFiles(input, sourceOutputDirectory, options);
    // render lib.rs and Cargo.toml
    if (options.supportFiles) {
      const supportOutput = await this.generateCompleteSupport(input, options);
      generatedModels = generatedModels.concat(supportOutput);
      for (const outputModel of supportOutput) {
        const filePath = path.resolve(outputDirectory, outputModel.model.name);
        await FileHelpers.writerToFileSystem(outputModel.result, filePath);
      }
    }
    return generatedModels;
  }
}
