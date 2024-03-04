import { Flags } from '@oclif/core';
import Command from '../../../base';
import { getCurrentContext, CONTEXT_FILE_PATH } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
  ContextFileEmptyError,
  ContextNotFoundError,
} from '../../../errors/context-error';

export default class ContextCurrent extends Command {
  static description = 'Shows the current context that is being used';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  async run() {
    let fileContent;

    try {
      fileContent = await getCurrentContext();
    } catch (e) {
      if (
        e instanceof (MissingContextFileError || ContextFileWrongFormatError)
      ) {
        this.log(
          'You have no context file configured. Run "modelina config context init" to initialize it.'
        );
        return;
      } else if (e instanceof ContextFileEmptyError) {
        this.log(`Context file "${CONTEXT_FILE_PATH}" is empty.`);
        return;
      } else if (
        e instanceof ContextNotFoundError ||
        (fileContent && !fileContent.current)
      ) {
        this.log(
          'No context is set as current. Run "modelina config context" to see all available options.'
        );
        return;
      }
      throw e;
    }

    if (fileContent) {
      this.log(`${fileContent.current}: ${fileContent.context}`);
    }
  }
}
