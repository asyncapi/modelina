import { promises as fs } from 'fs';
import path from 'path';
import { URL } from 'url';
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { loadContext } from './Context';
import { ErrorLoadingSpec } from '../errors/specification-file';
import { MissingContextFileError } from '../errors/context-error';

const { readFile, lstat } = fs;
const allowedFileNames: string[] = [
  'asyncapi.json',
  'asyncapi.yml',
  'asyncapi.yaml'
];
const TYPE_CONTEXT_NAME = 'context-name';
const TYPE_FILE_PATH = 'file-path';
const TYPE_URL = 'url-path';

export class Specification {
  private readonly spec: string;
  private readonly filePath?: string;
  private readonly fileURL?: string;
  private readonly kind?: 'file' | 'url';

  constructor(spec: string, options: { filepath?: string, fileURL?: string } = {}) {
    this.spec = spec;
    if (options.filepath) {
      this.filePath = options.filepath;
      this.kind = 'file';
    } else if (options.fileURL) {
      this.fileURL = options.fileURL;
      this.kind = 'url';
    }
  }

  isAsyncAPI3() {
    const jsObj = this.toJson();
    return jsObj.asyncapi === '3.0.0';
  }

  toJson(): Record<string, any> {
    try {
      return yaml.load(this.spec, {json: true}) as Record<string, any>;
    } catch (e) {
      return JSON.parse(this.spec);
    }
  }

  text() {
    return this.spec;
  }

  getFilePath() {
    return this.filePath;
  }

  getFileURL() {
    return this.fileURL;
  }

  getKind() {
    return this.kind;
  }

  getSource() {
    return this.getFilePath() ?? this.getFileURL();
  }

  toSourceString() {
    if (this.kind === 'file') {
      return `File ${this.filePath}`;
    }
    return `URL ${this.fileURL}`;
  }

  static async fromFile(filepath: string) {
    let spec;
    try {
      spec = await readFile(filepath, { encoding: 'utf8' });
    } catch (error) {
      throw new ErrorLoadingSpec('file', filepath);
    }
    return new Specification(spec, { filepath });
  }

  static async fromURL(URLpath: string) {
    let response;
    try {
      response = await fetch(URLpath, { method: 'GET' });
      if (!response.ok) {
        throw new ErrorLoadingSpec('url', URLpath);
      }
    } catch (error) {
      throw new ErrorLoadingSpec('url', URLpath);
    }
    return new Specification(await response?.text() as string, { fileURL: URLpath });
  }
}

export default class SpecificationFile {
  private readonly pathToFile: string;

  constructor(filePath: string) {
    this.pathToFile = filePath;
  }

  getPath(): string {
    return this.pathToFile;
  }

  async read(): Promise<string> {
    return readFile(this.pathToFile, { encoding: 'utf8' });
  }
}

interface LoadType {
  file?: boolean
  url?: boolean
  context?: boolean
}

/* eslint-disable sonarjs/cognitive-complexity */
export async function load(filePathOrContextName?: string, loadType?: LoadType): Promise<Specification> { // NOSONAR
  if (filePathOrContextName) {
    if (loadType?.file) { return Specification.fromFile(filePathOrContextName); }
    if (loadType?.context) { return loadFromContext(filePathOrContextName); }
    if (loadType?.url) { return Specification.fromURL(filePathOrContextName); }

    const type = await nameType(filePathOrContextName);
    if (type === TYPE_CONTEXT_NAME) {
      return loadFromContext(filePathOrContextName);
    }

    if (type === TYPE_URL) {
      return Specification.fromURL(filePathOrContextName);
    }
    await fileExists(filePathOrContextName);
    return Specification.fromFile(filePathOrContextName);
  }

  try {
    return await loadFromContext();
  } catch (e) {
    const autoDetectedSpecFile = await detectSpecFile();
    if (autoDetectedSpecFile) {
      return Specification.fromFile(autoDetectedSpecFile);
    }

    if (e instanceof MissingContextFileError) {
      throw new ErrorLoadingSpec();
    }

    throw e;
  }
}

export async function nameType(name: string): Promise<string> {
  if (name.startsWith('.')) {
    return TYPE_FILE_PATH;
  }

  try {
    if (await fileExists(name)) {
      return TYPE_FILE_PATH;
    }
    return TYPE_CONTEXT_NAME;
  } catch (e) {
    if (await isURL(name)) { return TYPE_URL; }
    return TYPE_CONTEXT_NAME;
  }
}

export async function isURL(urlpath: string): Promise<boolean> {
  try {
    const url = new URL(urlpath);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

export async function fileExists(name: string): Promise<boolean> {
  try {
    if ((await lstat(name)).isFile()) {
      return true;
    }
    
    const extension = name.split('.')[1];
    
    const allowedExtenstion=['yml','yaml','json'];

    if (!allowedExtenstion.includes(extension)) {
      throw new ErrorLoadingSpec('invalid file',name);
    }
   
    throw new ErrorLoadingSpec('file', name);
  } catch (e) {
    throw new ErrorLoadingSpec('file', name);
  }
}

async function loadFromContext(contextName?: string): Promise<Specification> {
  try {
    const context = await loadContext(contextName);
    return Specification.fromFile(context);
  } catch (error) {
    if (error instanceof MissingContextFileError) {throw new ErrorLoadingSpec();}
    throw error;
  }
}

async function detectSpecFile(): Promise<string | undefined> {
  const existingFileNames = await Promise.all(allowedFileNames.map(async filename => {
    try {
      const exists = await fileExists(path.resolve(process.cwd(), filename));
      return exists ? filename : undefined;
    } catch (e) {
      // We did our best...
    }
  }));
  return existingFileNames.find(filename => filename !== undefined);
}

