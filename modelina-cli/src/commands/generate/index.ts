import Command from '../../base.js';
import { Help } from '@oclif/core';

export default class Generate extends Command {
  static description = 'Generate typed models or other things like clients, applications or docs using AsyncAPI Generator templates.';
  async run() {
    const help = new Help(this.config);
    help.showHelp(['generate', '--help']);
  }
}
