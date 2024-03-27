import { Flags } from '@oclif/core';
import Command from '../../../base';
import { removeContext, CONTEXT_FILE_PATH } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
  ContextFileEmptyError,
} from '../../../errors/context-error';

export default class ContextRemove extends Command {
  static description = 'Delete a context from the store';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = [
    {
      name: 'context-name',
      description: 'Name of the context to delete',
      required: true,
    },
  ];

  async run() {
    const { args } = await this.parse(ContextRemove);
    const contextName = args['context-name'];

    try {
      await removeContext(contextName);
      this.log(`${contextName} successfully deleted`);
    } catch (error) {
      if (
        error instanceof (MissingContextFileError || ContextFileWrongFormatError)
      ) {
        this.log(
          'You have no context file configured. Run "modelina config context init" to initialize it.'
        );
        return;
      }

 if (error instanceof ContextFileEmptyError) {
        this.log(`Context file "${CONTEXT_FILE_PATH}" is empty.`);
        return;
      }

      throw error;
    }
  }
}
