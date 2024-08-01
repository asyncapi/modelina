/* eslint-disable no-undef */
import { promisify } from 'util';
import { exec } from 'child_process';
const promiseExec = promisify(exec);

/**
 * Execute a command and if any errors occur reject the promise.
 *
 * @param command
 */
export async function execCommand(
  command: string,
  allowStdError = false
): Promise<void> {
  try {
    const { stderr } = await promiseExec(command);
    if (stderr !== '') {
      if (!allowStdError) {
        return Promise.reject(stderr);
      }
      // eslint-disable-next-line no-console
      console.error(stderr);
    }
    return Promise.resolve();
  } catch (e: any) {
    return Promise.reject(`${e.stack}; Stdout: ${e.stdout}`);
  }
}
/**
 * Ensure object does not contain undefined properties when matching outputs
 */
export function removeEmptyPropertiesFromObjects(obj: any): any {
  if(typeof obj !== 'object') return obj;
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmptyPropertiesFromObjects(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}
