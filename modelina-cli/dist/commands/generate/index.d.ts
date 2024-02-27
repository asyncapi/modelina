import Command from '../../base.js';
export default class Generate extends Command {
    static description: string;
    run(): Promise<void>;
}
