import { Args, Flags } from '@oclif/core';
import Command from '../../../base';
import { initContext } from '../../../models/Context';

export default class ContextInit extends Command {
  static description = 'Initialize context';
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static contextFilePathMessage = `Specify directory in which context file should be created:
    - current directory          : modelina config context init . (default)
    - root of current repository : modelina config context init ./
    - user's home directory      : modelina config context init ~`;

  static args = {
    'context-file-path': Args.string({description: `${ContextInit.contextFilePathMessage}`, required: false})
  };

  async run() {
    const { args } = await this.parse(ContextInit);
    const contextFilePath = args['context-file-path'];

    const contextWritePath = await initContext(contextFilePath);
    this.log(`Initialized context ${contextWritePath}`);
  }
}
