import { loadHelpClass } from '@oclif/core';
import Command from '../../../base';

export default class Context extends Command {
  static description =
    'Manage short aliases for full paths to inputs';

  async run() {
    const Help = await loadHelpClass(this.config);
    const help = new Help(this.config);
    help.showHelp(['config', 'context', '--help']);
  }
}
