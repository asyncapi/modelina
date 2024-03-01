export const NO_CONTEXTS_SAVED = `These are your options to specify in the CLI what AsyncAPI file should be used:
	- You can provide a path to the AsyncAPI file: asyncapi <command> path/to/file/asyncapi.yml
	- You can provide URL to the AsyncAPI file: asyncapi <command> https://example.com/path/to/file/asyncapi.yml
	- You can also pass a saved context that points to your AsyncAPI file: asyncapi <command> context-name
	- In case you did not specify a context that you want to use, the CLI checks if there is a default context and uses it. To set default context run: asyncapi config context use mycontext
	- In case you did not provide any reference to AsyncAPI file and there is no default context, the CLI detects if in your current working directory you have files like asyncapi.json, asyncapi.yaml, asyncapi.yml. Just rename your file accordingly.
`;
const MISSING_CURRENT_CONTEXT =
  'No context is set as current, please set a current context.';
const CONTEXT_NOT_FOUND = (contextName: string) =>
  `Context "${contextName}" does not exist.`;
const CONTEXT_ALREADY_EXISTS = (contextName: string, contextFileName: string) =>
  `Context with name "${contextName}" already exists in context file "${contextFileName}".`;
const CONTEXT_FILE_WRONG_FORMAT = (contextFileName: string) =>
  `Context file "${contextFileName}" has wrong format. Make sure your context file follows the structure described in section "Context File structure" at https://www.asyncapi.com/docs/tools/cli/context#context-file-structure`;
const CONTEXT_FILE_EMPTY = (contextFileName: string) =>
  `Context file "${contextFileName}" is empty.`;
const CONTEXT_FILE_WRITE_ERROR = (contextFileName: string) =>
  `Error writing context file "${contextFileName}".`;

class ContextError extends Error {
  constructor() {
    super();
    this.name = 'ContextError';
  }
}

export class MissingContextFileError extends ContextError {
  constructor() {
    super();
    this.message = NO_CONTEXTS_SAVED;
  }
}

export class MissingCurrentContextError extends ContextError {
  constructor() {
    super();
    this.message = MISSING_CURRENT_CONTEXT;
  }
}

export class ContextNotFoundError extends ContextError {
  constructor(contextName: string) {
    super();
    this.message = CONTEXT_NOT_FOUND(contextName);
  }
}

export class ContextAlreadyExistsError extends ContextError {
  constructor(contextName: string, contextFileName: string) {
    super();
    this.message = CONTEXT_ALREADY_EXISTS(contextName, contextFileName);
  }
}

export class ContextFileWrongFormatError extends ContextError {
  constructor(contextFileName: string) {
    super();
    this.message = CONTEXT_FILE_WRONG_FORMAT(contextFileName);
  }
}

export class ContextFileEmptyError extends ContextError {
  constructor(contextFileName: string) {
    super();
    this.message = CONTEXT_FILE_EMPTY(contextFileName);
  }
}

export class ContextFileWriteError extends ContextError {
  constructor(contextFileName: string) {
    super();
    this.message = CONTEXT_FILE_WRITE_ERROR(contextFileName);
  }
}
