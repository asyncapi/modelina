export declare const NO_CONTEXTS_SAVED = "These are your options to specify in the CLI what AsyncAPI file should be used:\n\t- You can provide a path to the AsyncAPI file: asyncapi <command> path/to/file/asyncapi.yml\n\t- You can provide URL to the AsyncAPI file: asyncapi <command> https://example.com/path/to/file/asyncapi.yml\n\t- You can also pass a saved context that points to your AsyncAPI file: asyncapi <command> context-name\n\t- In case you did not specify a context that you want to use, the CLI checks if there is a default context and uses it. To set default context run: asyncapi config context use mycontext\n\t- In case you did not provide any reference to AsyncAPI file and there is no default context, the CLI detects if in your current working directory you have files like asyncapi.json, asyncapi.yaml, asyncapi.yml. Just rename your file accordingly.\n";
declare class ContextError extends Error {
    constructor();
}
export declare class MissingContextFileError extends ContextError {
    constructor();
}
export declare class MissingCurrentContextError extends ContextError {
    constructor();
}
export declare class ContextNotFoundError extends ContextError {
    constructor(contextName: string);
}
export declare class ContextAlreadyExistsError extends ContextError {
    constructor(contextName: string, contextFileName: string);
}
export declare class ContextFileWrongFormatError extends ContextError {
    constructor(contextFileName: string);
}
export declare class ContextFileEmptyError extends ContextError {
    constructor(contextFileName: string);
}
export declare class ContextFileWriteError extends ContextError {
    constructor(contextFileName: string);
}
export {};
