import { Command } from '@oclif/core';

export default abstract class ModelinaCommand extends Command {
  async catch(err: Error & { exitCode?: number; }): Promise<any> {
    try {
      return await super.catch(err);
    } catch (error: any) {
      if (error instanceof Error) {
        this.logToStderr(`${error.name}: ${error.message}`);
        process.exitCode = 1;
      }
    }
  }
}
