import ModelinaCommand from '../../base';
import { Help } from '@oclif/core';

export default class Generate extends ModelinaCommand {
  static description = 'Generate models using AsyncAPI Modelina.';
  async run() {
    const help = new Help(this.config);
    help.showHelp(['generate', '--help']);
  }
}
