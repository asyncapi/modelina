import { Args, Flags } from '@oclif/core';
import Command from '../../../base';
import { setCurrentContext, CONTEXT_FILE_PATH } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
  ContextFileEmptyError,
} from '../../../errors/context-error';

export default class ContextUse extends Command {
  static description = 'Set a context as current';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = {
    'context-name': Args.string({description: 'name of the saved context', required: true}),
  };

  async run() {
    const { args } = await this.parse(ContextUse);
    const contextName = args['context-name'];

    try {
      await setCurrentContext(contextName);
      this.log(`${contextName} is set as current`);
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
