import { NO_CONTEXTS_SAVED } from './context-error';
class SpecificationFileError extends Error {
  constructor() {
    super();
    this.name = 'SpecificationFileError';
  }
}

export class SpecificationFileNotFound extends SpecificationFileError {
  constructor(filePath?: string) {
    super();
    if (filePath) {
      this.message = `File ${filePath} does not exist.`;
    } else {
      this.message = 'We could not find any AsyncAPI file.';
    }
  }
}

export class SpecificationURLNotFound extends SpecificationFileError {
  constructor(URL: string) {
    super();
    this.message = `Unable to fetch specification file from url: ${URL}`;
  }
}

type From = 'file' | 'url' | 'context' | 'invalid file'

export class ErrorLoadingSpec extends Error {
  private readonly errorMessages = {
    default: NO_CONTEXTS_SAVED
  };
  constructor(from?: From, param?: string) {
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
