/* eslint-disable no-undef */
/* eslint-disable security/detect-non-literal-fs-filename */
import {promises as fs} from 'fs';
import * as path from 'path';
import { AbstractGenerator, FormatHelpers, OutputModel } from '../../../src';
import {promisify} from 'util';
import {exec} from 'child_process';
const promiseExec = promisify(exec);

/**
 * Exec a command and if any errors occur reject the promise.
 * 
 * @param absolutePathToFile 
 * @param generator  
 */
export async function generateModels(absolutePathToFile: string, generator: AbstractGenerator): Promise<OutputModel[]> {
  const inputFileContent = await fs.readFile(absolutePathToFile);
  const input = JSON.parse(String(inputFileContent));
  return generator.generate(input);
}
/**
 * Execute a command and if any errors occur reject the promise.
 * 
 * @param command 
 */
export async function execCommand(command: string) : Promise<void> {
  try {
    const { stderr } = await promiseExec(command);
    if (stderr !== '') {
      Promise.reject(stderr);
    }
  } catch (e) {
    Promise.reject(e);
  }
}

/**
 * Render all models to separate files in the same directory
 * 
 * @param generatedModels to write to file
 * @param outputPath absolute path to output directory
 */
export async function renderJavaModelsToSeparateFiles(generatedModels: OutputModel[], outputPath: string): Promise<void> {
  await fs.rm(outputPath, { recursive: true, force: true });
  await fs.mkdir(outputPath, { recursive: true });
  for (const outputModel of generatedModels) {
    const outputFilePath = path.resolve(outputPath, `${FormatHelpers.toPascalCase(outputModel.model.$id || 'undefined')}.java`);
    const outputContent = `
${outputModel.dependencies.map((dependency) => { return `import ${dependency}`; }).join('\n')}
${outputModel.result}
`;
    await fs.writeFile(outputFilePath, outputContent);
  }
}

/**
 * Render all models to a single file
 * 
 * @param models to write to file
 * @param outputPath path to output
 */
export async function renderModels(generatedModels: OutputModel[], outputPath: string): Promise<void> {
  const outputDir = path.resolve(__dirname, path.dirname(outputPath));
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const output = generatedModels.map((model) => {
    return model.result;
  });
  const outputFilePath = path.resolve(__dirname, outputPath);
  await fs.writeFile(outputFilePath, output.join('\n'));
}
