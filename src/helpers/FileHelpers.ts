import * as fs from 'fs';
import * as path from 'path';
export class FileHelpers {
  /**
   * Node specific file writer, which writes the content to the specified filepath.
   * 
   * This function is invasive, as it overwrite any existing files with the same name as the model.
   * 
   * @param content to write
   * @param filePath to write to
   */
  static async writerToFileSystem(content: string, filePath: string): Promise<void> {
    const outputFilePath = path.resolve(filePath);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.promises.writeFile(outputFilePath, content);
  }
}
