"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_js_1 = tslib_1.__importDefault(require("../../base.js"));
const core_1 = require("@oclif/core");
class Generate extends base_js_1.default {
    static description = 'Generate typed models or other things like clients, applications or docs using AsyncAPI Generator templates.';
    async run() {
        const help = new core_1.Help(this.config);
        help.showHelp(['generate', '--help']);
    }
}
exports.default = Generate;
