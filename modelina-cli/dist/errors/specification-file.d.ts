declare class SpecificationFileError extends Error {
    constructor();
}
export declare class SpecificationFileNotFound extends SpecificationFileError {
    constructor(filePath?: string);
}
export declare class SpecificationURLNotFound extends SpecificationFileError {
    constructor(URL: string);
}
declare type From = 'file' | 'url' | 'context' | 'invalid file';
export declare class ErrorLoadingSpec extends Error {
    private readonly errorMessages;
    constructor(from?: From, param?: string);
}
export {};
