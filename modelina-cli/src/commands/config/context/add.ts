import { Flags } from '@oclif/core';
import Command from '../../../base';
import { addContext, setCurrentContext } from '../../../models/Context';
import {
  MissingContextFileError,
  ContextFileWrongFormatError,
} from '../../../errors/context-error';

export default class ContextAdd extends Command {
  static description = 'Add a context to the store';
  static flags = {
    help: Flags.help({ char: 'h' }),
    'set-current': Flags.boolean({
      char: 's',
      description: 'Set context being added as the current context',
      default: false,
      required: false,
    })
  };

  static args = [
    { name: 'context-name', description: 'context name', required: true },
    {
      name: 'spec-file-path',
      description: 'file path of the input document',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = await this.parse(ContextAdd);
    const contextName = args['context-name'];
    const specFilePath = args['spec-file-path'];
    const setAsCurrent = flags['set-current'];

    try {
      await addContext(contextName, specFilePath);
      this.log(
        `Added context "${contextName}".\n\nYou can set it as your current context: modelina config context use ${contextName}\nYou can use this context when needed by passing ${contextName} as a parameter: modelina validate ${contextName}`
      );

      if (setAsCurrent) {
        await setCurrentContext(contextName);
        this.log(
          `The newly added context "${contextName}", is set as your current context!`
        );
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
