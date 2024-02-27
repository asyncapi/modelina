"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextFileWriteError = exports.ContextFileEmptyError = exports.ContextFileWrongFormatError = exports.ContextAlreadyExistsError = exports.ContextNotFoundError = exports.MissingCurrentContextError = exports.MissingContextFileError = exports.NO_CONTEXTS_SAVED = void 0;
exports.NO_CONTEXTS_SAVED = `These are your options to specify in the CLI what AsyncAPI file should be used:
	- You can provide a path to the AsyncAPI file: asyncapi <command> path/to/file/asyncapi.yml
	- You can provide URL to the AsyncAPI file: asyncapi <command> https://example.com/path/to/file/asyncapi.yml
	- You can also pass a saved context that points to your AsyncAPI file: asyncapi <command> context-name
	- In case you did not specify a context that you want to use, the CLI checks if there is a default context and uses it. To set default context run: asyncapi config context use mycontext
	- In case you did not provide any reference to AsyncAPI file and there is no default context, the CLI detects if in your current working directory you have files like asyncapi.json, asyncapi.yaml, asyncapi.yml. Just rename your file accordingly.
`;
const MISSING_CURRENT_CONTEXT = 'No context is set as current, please set a current context.';
const CONTEXT_NOT_FOUND = (contextName) => `Context "${contextName}" does not exist.`;
const CONTEXT_ALREADY_EXISTS = (contextName, contextFileName) => `Context with name "${contextName}" already exists in context file "${contextFileName}".`;
const CONTEXT_FILE_WRONG_FORMAT = (contextFileName) => `Context file "${contextFileName}" has wrong format. Make sure your context file follows the structure described in section "Context File structure" at https://www.asyncapi.com/docs/tools/cli/context#context-file-structure`;
const CONTEXT_FILE_EMPTY = (contextFileName) => `Context file "${contextFileName}" is empty.`;
const CONTEXT_FILE_WRITE_ERROR = (contextFileName) => `Error writing context file "${contextFileName}".`;
class ContextError extends Error {
    constructor() {
        super();
        this.name = 'ContextError';
    }
}
class MissingContextFileError extends ContextError {
    constructor() {
        super();
        this.message = exports.NO_CONTEXTS_SAVED;
    }
}
exports.MissingContextFileError = MissingContextFileError;
class MissingCurrentContextError extends ContextError {
    constructor() {
        super();
        this.message = MISSING_CURRENT_CONTEXT;
    }
}
exports.MissingCurrentContextError = MissingCurrentContextError;
class ContextNotFoundError extends ContextError {
    constructor(contextName) {
        super();
        this.message = CONTEXT_NOT_FOUND(contextName);
    }
}
exports.ContextNotFoundError = ContextNotFoundError;
class ContextAlreadyExistsError extends ContextError {
    constructor(contextName, contextFileName) {
        super();
        this.message = CONTEXT_ALREADY_EXISTS(contextName, contextFileName);
    }
}
exports.ContextAlreadyExistsError = ContextAlreadyExistsError;
class ContextFileWrongFormatError extends ContextError {
    constructor(contextFileName) {
        super();
        this.message = CONTEXT_FILE_WRONG_FORMAT(contextFileName);
    }
}
exports.ContextFileWrongFormatError = ContextFileWrongFormatError;
class ContextFileEmptyError extends ContextError {
    constructor(contextFileName) {
        super();
        this.message = CONTEXT_FILE_EMPTY(contextFileName);
    }
}
exports.ContextFileEmptyError = ContextFileEmptyError;
class ContextFileWriteError extends ContextError {
    constructor(contextFileName) {
        super();
        this.message = CONTEXT_FILE_WRITE_ERROR(contextFileName);
    }
}
exports.ContextFileWriteError = ContextFileWriteError;
