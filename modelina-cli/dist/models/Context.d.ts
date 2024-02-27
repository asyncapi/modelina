export declare const DEFAULT_CONTEXT_FILE_PATH: string;
export declare let CONTEXT_FILE_PATH: string;
export interface IContextFile {
    current?: string;
    readonly store: {
        [name: string]: string;
    };
}
export interface ICurrentContext {
    readonly current: string;
    readonly context: string;
}
export declare function initContext(contextFilePath: string): Promise<string>;
export declare function loadContext(contextName?: string): Promise<string>;
export declare function addContext(contextName: string, pathToFile: string): Promise<void>;
export declare function removeContext(contextName: string): Promise<void>;
export declare function getCurrentContext(): Promise<ICurrentContext>;
export declare function setCurrentContext(contextName: string): Promise<void>;
export declare function editContext(contextName: string, pathToFile: string): Promise<void>;
export declare function loadContextFile(): Promise<IContextFile>;
export declare function isContextFileEmpty(fileContent: IContextFile): Promise<boolean>;
