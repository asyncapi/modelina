exports.TypeScriptInputProcessor = void 0;
const AbstractInputProcessor_1 = require("@asyncapi/modelina");
class TypeScriptInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    shouldProcess(input) {
        return false;
    }
    process(input, options) {
        return Promise.reject();
    }
}
exports.TypeScriptInputProcessor = TypeScriptInputProcessor;
TypeScriptInputProcessor.settings = {
    uniqueNames: false,
    required: true,
    compilerOptions: {
        strictNullChecks: false
    }
};
//# sourceMappingURL=TypeScriptInputProcessor.js.map