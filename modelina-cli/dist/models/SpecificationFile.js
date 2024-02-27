"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = exports.isURL = exports.nameType = exports.load = exports.Specification = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const url_1 = require("url");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
const Context_1 = require("./Context");
const specification_file_1 = require("../errors/specification-file");
const context_error_1 = require("../errors/context-error");
const { readFile, lstat } = fs_1.promises;
const allowedFileNames = [
    'asyncapi.json',
    'asyncapi.yml',
    'asyncapi.yaml'
];
const TYPE_CONTEXT_NAME = 'context-name';
const TYPE_FILE_PATH = 'file-path';
const TYPE_URL = 'url-path';
class Specification {
    spec;
    filePath;
    fileURL;
    kind;
    constructor(spec, options = {}) {
        this.spec = spec;
        if (options.filepath) {
            this.filePath = options.filepath;
            this.kind = 'file';
        }
        else if (options.fileURL) {
            this.fileURL = options.fileURL;
            this.kind = 'url';
        }
    }
    isAsyncAPI3() {
        const jsObj = this.toJson();
        return jsObj.asyncapi === '3.0.0';
    }
    toJson() {
        try {
            return js_yaml_1.default.load(this.spec, { json: true });
        }
        catch (e) {
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
    static async fromFile(filepath) {
        let spec;
        try {
            spec = await readFile(filepath, { encoding: 'utf8' });
        }
        catch (error) {
            throw new specification_file_1.ErrorLoadingSpec('file', filepath);
        }
        return new Specification(spec, { filepath });
    }
    static async fromURL(URLpath) {
        let response;
        try {
            response = await (0, node_fetch_1.default)(URLpath, { method: 'GET' });
            if (!response.ok) {
                throw new specification_file_1.ErrorLoadingSpec('url', URLpath);
            }
        }
        catch (error) {
            throw new specification_file_1.ErrorLoadingSpec('url', URLpath);
        }
        return new Specification(await response?.text(), { fileURL: URLpath });
    }
}
exports.Specification = Specification;
class SpecificationFile {
    pathToFile;
    constructor(filePath) {
        this.pathToFile = filePath;
    }
    getPath() {
        return this.pathToFile;
    }
    async read() {
        return readFile(this.pathToFile, { encoding: 'utf8' });
    }
}
exports.default = SpecificationFile;
/* eslint-disable sonarjs/cognitive-complexity */
async function load(filePathOrContextName, loadType) {
    if (filePathOrContextName) {
        if (loadType?.file) {
            return Specification.fromFile(filePathOrContextName);
        }
        if (loadType?.context) {
            return loadFromContext(filePathOrContextName);
        }
        if (loadType?.url) {
            return Specification.fromURL(filePathOrContextName);
        }
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
    }
    catch (e) {
        const autoDetectedSpecFile = await detectSpecFile();
        if (autoDetectedSpecFile) {
            return Specification.fromFile(autoDetectedSpecFile);
        }
        if (e instanceof context_error_1.MissingContextFileError) {
            throw new specification_file_1.ErrorLoadingSpec();
        }
        throw e;
    }
}
exports.load = load;
async function nameType(name) {
    if (name.startsWith('.')) {
        return TYPE_FILE_PATH;
    }
    try {
        if (await fileExists(name)) {
            return TYPE_FILE_PATH;
        }
        return TYPE_CONTEXT_NAME;
    }
    catch (e) {
        if (await isURL(name)) {
            return TYPE_URL;
        }
        return TYPE_CONTEXT_NAME;
    }
}
exports.nameType = nameType;
async function isURL(urlpath) {
    try {
        const url = new url_1.URL(urlpath);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch (error) {
        return false;
    }
}
exports.isURL = isURL;
async function fileExists(name) {
    try {
        if ((await lstat(name)).isFile()) {
            return true;
        }
        const extension = name.split('.')[1];
        const allowedExtenstion = ['yml', 'yaml', 'json'];
        if (!allowedExtenstion.includes(extension)) {
            throw new specification_file_1.ErrorLoadingSpec('invalid file', name);
        }
        throw new specification_file_1.ErrorLoadingSpec('file', name);
    }
    catch (e) {
        throw new specification_file_1.ErrorLoadingSpec('file', name);
    }
}
exports.fileExists = fileExists;
async function loadFromContext(contextName) {
    try {
        const context = await (0, Context_1.loadContext)(contextName);
        return Specification.fromFile(context);
    }
    catch (error) {
        if (error instanceof context_error_1.MissingContextFileError) {
            throw new specification_file_1.ErrorLoadingSpec();
        }
        throw error;
    }
}
async function detectSpecFile() {
    const existingFileNames = await Promise.all(allowedFileNames.map(async (filename) => {
        try {
            const exists = await fileExists(path_1.default.resolve(process.cwd(), filename));
            return exists ? filename : undefined;
        }
        catch (e) {
            // We did our best...
        }
    }));
    return existingFileNames.find(filename => filename !== undefined);
}
