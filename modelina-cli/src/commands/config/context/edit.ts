import { Flags } from '@oclif/core';
import Command from '../../../base';
import { editContext, CONTEXT_FILE_PATH } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
  ContextFileEmptyError,
} from '../../../errors/context-error';

export default class ContextEdit extends Command {
  static description = 'Edit a context in the store';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'context-name', description: 'context name', required: true },
    {
      name: 'new-spec-file-path',
      description: 'new file path of the input',
      required: true,
    },
  ];

  async run() {
    const { args } = await this.parse(ContextEdit);
    const contextName = args['context-name'];
    const newSpecFilePath = args['new-spec-file-path'];

    try {
      await editContext(contextName, newSpecFilePath);
      this.log(
        `Edited context "${contextName}".\n\nYou can set it as your current context: modelina config context use ${contextName}\nYou can use this context when needed by passing ${contextName} as a parameter: modelina validate ${contextName}`
      );
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
      }
      throw e;
    }
  }
}
