import * as fs from 'fs';
import * as path from 'path';

/**
 * Convert a string into utf-8 encoding and return the byte size.
 */
function lengthInUtf8Bytes(str: string): number {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

export class FileHelpers {
  /**
   * Node specific file writer, which writes the content to the specified filepath.
   * 
   * This function is invasive, as it overwrite any existing files with the same name as the model.
   * 
   * @param content to write
   * @param filePath to write to,
   * @param skipCheck skip checking if the file is written, it can happen that the promise is returned before the file is actually written.
   */
  static async writerToFileSystem(content: string, filePath: string, skipFileCheck = true): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const outputFilePath = path.resolve(filePath);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true });
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.promises.writeFile(outputFilePath, content);
  
        /**
         * It happens that the promise is resolved before the file is actually written to.
         * 
         * This often happen if the file system is swamped with write requests in either benchmarks or in our blackbox tests.
         * 
         * To avoid this we dont resolve until we are sure the file is written and exists.
         */
        if(!skipFileCheck) {
          const timerId = setInterval(async () => {
            try {
              const isExists = await fs.promises.stat(outputFilePath);
              if(isExists && isExists.size === lengthInUtf8Bytes(content)) {
                clearInterval(timerId);
                resolve();
              }
            } catch(e){}
          }, 10);
        } else {
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
