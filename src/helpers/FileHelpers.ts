import {promises as fs} from 'fs';
import * as path from 'path';

export class FileHelpers {
  static async writeToFile(content: string, outputFile: string): Promise<void> {
    const outputFilePath = path.resolve(outputFile);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.writeFile(outputFilePath, content);
  }
}
