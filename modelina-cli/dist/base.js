"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class ModelinaCommand extends core_1.Command {
    async catch(err) {
        try {
            return await super.catch(err);
        }
        catch (e) {
            if (e instanceof Error) {
                this.logToStderr(`${e.name}: ${e.message}`);
                process.exitCode = 1;
            }
        }
    }
}
exports.default = ModelinaCommand;
