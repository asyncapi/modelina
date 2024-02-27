export declare class Specification {
    private readonly spec;
    private readonly filePath?;
    private readonly fileURL?;
    private readonly kind?;
    constructor(spec: string, options?: {
        filepath?: string;
        fileURL?: string;
    });
    isAsyncAPI3(): boolean;
    toJson(): Record<string, any>;
    text(): string;
    getFilePath(): string | undefined;
    getFileURL(): string | undefined;
    getKind(): "file" | "url" | undefined;
    getSource(): string | undefined;
    toSourceString(): string;
    static fromFile(filepath: string): Promise<Specification>;
    static fromURL(URLpath: string): Promise<Specification>;
}
export default class SpecificationFile {
    private readonly pathToFile;
    constructor(filePath: string);
    getPath(): string;
    read(): Promise<string>;
}
interface LoadType {
    file?: boolean;
    url?: boolean;
    context?: boolean;
}
export declare function load(filePathOrContextName?: string, loadType?: LoadType): Promise<Specification>;
export declare function nameType(name: string): Promise<string>;
export declare function isURL(urlpath: string): Promise<boolean>;
export declare function fileExists(name: string): Promise<boolean>;
export {};
