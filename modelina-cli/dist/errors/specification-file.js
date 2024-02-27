"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLoadingSpec = exports.SpecificationURLNotFound = exports.SpecificationFileNotFound = void 0;
const context_error_1 = require("./context-error");
class SpecificationFileError extends Error {
    constructor() {
        super();
        this.name = 'SpecificationFileError';
    }
}
class SpecificationFileNotFound extends SpecificationFileError {
    constructor(filePath) {
        super();
        if (filePath) {
            this.message = `File ${filePath} does not exist.`;
        }
        else {
            this.message = 'We could not find any AsyncAPI file.';
        }
    }
}
exports.SpecificationFileNotFound = SpecificationFileNotFound;
class SpecificationURLNotFound extends SpecificationFileError {
    constructor(URL) {
        super();
        this.message = `Unable to fetch specification file from url: ${URL}`;
    }
}
exports.SpecificationURLNotFound = SpecificationURLNotFound;
class ErrorLoadingSpec extends Error {
    errorMessages = {
        default: context_error_1.NO_CONTEXTS_SAVED
    };
    constructor(from, param) {
        super();
        if (from === 'file') {
            this.name = 'error loading AsyncAPI document from file';
            this.message = `${param} file does not exist.`;
        }
        if (from === 'url') {
            this.name = 'error loading AsyncAPI document from url';
            this.message = `Failed to download ${param}.`;
        }
        if (from === 'context') {
            this.name = 'error loading AsyncAPI document from context';
            this.message = `${param} context name does not exist.`;
        }
        if (from === 'invalid file') {
            this.name = 'Invalid AsyncAPI file type';
            this.message = 'cli only supports yml ,yaml ,json extension';
        }
        if (!from) {
            this.name = 'error locating AsyncAPI document';
            this.message = this.errorMessages.default;
        }
    }
}
exports.ErrorLoadingSpec = ErrorLoadingSpec;
