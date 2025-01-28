import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Convert a string into utf-8 encoding and return the byte size.
 */
function lengthInUtf8Bytes(str: string): number {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
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
   * @param ensureFilesWritten veryify that the files is completely written before returning, this can happen if the file system is swamped with write requests.
   */
  static writerToFileSystem(
    content: string,
    filePath: string,
    ensureFilesWritten = false
  ): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const outputFilePath = path.resolve(filePath);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.writeFile(outputFilePath, content);

        /**
         * It happens that the promise is resolved before the file is actually written to.
         *
         * This often happen if the file system is swamped with write requests in either benchmarks
         *
         * To avoid this we dont resolve until we are sure the file is written and exists.
         */
        if (ensureFilesWritten) {
          // eslint-disable-next-line no-undef
          const timerId = setInterval(async () => {
            try {
              // eslint-disable-next-line security/detect-non-literal-fs-filename
              const isExists = await fs.stat(outputFilePath);
              if (isExists && isExists.size === lengthInUtf8Bytes(content)) {
                // eslint-disable-next-line no-undef
                clearInterval(timerId);
                resolve();
              }
            } catch (e) {
              // Ignore errors here as the file might not have been written yet
            }
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
