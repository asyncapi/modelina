import { Flags } from '@oclif/core';
import Command from '../../../base';
import {
  loadContextFile,
  isContextFileEmpty,
  CONTEXT_FILE_PATH,
} from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
} from '../../../errors/context-error';

export default class ContextList extends Command {
  static description = 'List all the stored contexts in the store';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  async run() {
    try {
      const fileContent = await loadContextFile();

      if (await isContextFileEmpty(fileContent)) {
        this.log(`Context file "${CONTEXT_FILE_PATH}" is empty.`);
        return;
      }

      if (fileContent) {
        for (const [contextName, filePath] of Object.entries(
          fileContent.store
        )) {
          this.log(`${contextName}: ${filePath}`);
        }
      }
    } catch (e) {
      if (
        e instanceof (MissingContextFileError || ContextFileWrongFormatError)
      ) {
        this.log(
          'You have no context file configured. Run "modelina config context init" to initialize it.'
        );
        return;
      }
      throw e;
    }
  }
}
