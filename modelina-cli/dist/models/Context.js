"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContextFileEmpty = exports.loadContextFile = exports.editContext = exports.setCurrentContext = exports.getCurrentContext = exports.removeContext = exports.addContext = exports.loadContext = exports.initContext = exports.CONTEXT_FILE_PATH = exports.DEFAULT_CONTEXT_FILE_PATH = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
const os = tslib_1.__importStar(require("os"));
const context_error_1 = require("../errors/context-error");
const { readFile, writeFile } = fs_1.promises;
// `repoRootPath` is optimistically assigned current working directory's
// filesystem path because chances are it will become 'official' repository root
// down the execution.
//
// `REPO_ROOT_PATH` will be converted to a real constant after migration of the
// codebase to ES2022 or higher and introduction of construction
//
// const REPO_ROOT_PATH = await getRepoRootPath(process.cwd());
//
// See explanation of the situation with `CONTEXT_FILE_PATH` below.
let REPO_ROOT_PATH = process.cwd();
getRepoRootPath(process.cwd());
const DEFAULT_CONTEXT_FILENAME = '.asyncapi-cli';
const DEFAULT_CONTEXT_FILE_LOCATION = os.homedir();
exports.DEFAULT_CONTEXT_FILE_PATH = path.resolve(DEFAULT_CONTEXT_FILE_LOCATION, DEFAULT_CONTEXT_FILENAME);
const CONTEXT_FILENAME = process.env.CUSTOM_CONTEXT_FILENAME || DEFAULT_CONTEXT_FILENAME;
const CONTEXT_FILE_LOCATION = process.env.CUSTOM_CONTEXT_FILE_LOCATION || DEFAULT_CONTEXT_FILE_LOCATION;
// Usage of promises for assignment of their resolved values to constants is
// known to be troublesome:
// https://www.reddit.com/r/learnjavascript/comments/p7p7zw/assigning_data_from_a_promise_to_a_constant
//
// In this particular case and usage of ES6, there is a race condition during
// code execution, due to faster assignment of default values to
// `CONTEXT_FILE_PATH` than resolution of the promise. This is the cause
// `CONTEXT_FILE_PATH` will always pick default values for context file's path
// instead of waiting for resolution of the promise from `getContextFilePath()`.
// The situation might become better with use of top-level await which should
// pause code execution, until promise in construction
//
// const CONTEXT_FILE_PATH = await getContextFilePath() || path.resolve(CONTEXT_FILE_LOCATION, CONTEXT_FILENAME) || DEFAULT_CONTEXT_FILE_PATH;
//
// is resolved, but for this to be checked, all codebase (including
// `@oclif/core`) needs to be migrated to ES2022 or higher.
//
// Until then `CONTEXT_FILE_PATH` name is mimicking a `const` while right now it
// is a `let` reassigned inside of `getContextFilePath()`.
exports.CONTEXT_FILE_PATH = path.resolve(CONTEXT_FILE_LOCATION, CONTEXT_FILENAME) ||
    exports.DEFAULT_CONTEXT_FILE_PATH;
// Sonar recognizes next line as a bug `Promises must be awaited, end with a
// call to .catch, or end with a call to .then with a rejection handler.` but
// due to absence of top-level await in ES6, this bug cannot be fixed without
// migrating the codebase to ES2022 or higher, thus suppressing Sonar analysis
// for this line.
getContextFilePath(); // NOSONAR
async function initContext(contextFilePath) {
    const fileContent = {
        store: {},
    };
    let contextWritePath = '';
    // prettier-ignore
    switch (contextFilePath) {
        /* eslint-disable indent */
        case '.':
            contextWritePath = process.cwd() + path.sep + CONTEXT_FILENAME;
            break;
        case './':
            contextWritePath = REPO_ROOT_PATH + path.sep + CONTEXT_FILENAME;
            break;
        // There are two variants of `~` case because tilde expansion in UNIX
        // systems is not a guaranteed feature - sometimes `~` can return just `~`
        // instead of home directory path.
        // https://stackoverflow.com/questions/491877/how-to-find-a-users-home-directory-on-linux-or-unix#comment17161699_492669
        case os.homedir():
            contextWritePath = os.homedir() + path.sep + CONTEXT_FILENAME;
            break;
        case '~':
            contextWritePath = os.homedir() + path.sep + CONTEXT_FILENAME;
            break;
        default:
            contextWritePath = process.cwd() + path.sep + CONTEXT_FILENAME;
    }
    try {
        await writeFile(contextWritePath, JSON.stringify(fileContent), {
            encoding: 'utf8',
        });
    }
    catch (e) {
        throw new context_error_1.ContextFileWriteError(contextWritePath);
    }
    return contextWritePath;
}
exports.initContext = initContext;
async function loadContext(contextName) {
    const fileContent = await loadContextFile();
    if (contextName) {
        const context = fileContent.store[String(contextName)];
        if (!context) {
            throw new context_error_1.ContextNotFoundError(contextName);
        }
        return context;
    }
    else if (fileContent.current) {
        const context = fileContent.store[fileContent.current];
        if (!context) {
            throw new context_error_1.ContextNotFoundError(fileContent.current);
        }
        return context;
    }
    throw new context_error_1.MissingCurrentContextError();
}
exports.loadContext = loadContext;
async function addContext(contextName, pathToFile) {
    const fileContent = await loadContextFile();
    // If context file already has context name similar to the one specified as
    // an argument, notify user about it (throw `ContextAlreadyExistsError`
    // error) and exit.
    if (fileContent.store.hasOwnProperty.call(fileContent.store, contextName)) {
        throw new context_error_1.ContextAlreadyExistsError(contextName, exports.CONTEXT_FILE_PATH);
    }
    fileContent.store[String(contextName)] = String(pathToFile);
    await saveContextFile(fileContent);
}
exports.addContext = addContext;
async function removeContext(contextName) {
    const fileContent = await loadContextFile();
    if (await isContextFileEmpty(fileContent)) {
        throw new context_error_1.ContextFileEmptyError(exports.CONTEXT_FILE_PATH);
    }
    if (!fileContent.store[String(contextName)]) {
        throw new context_error_1.ContextNotFoundError(contextName);
    }
    if (fileContent.current === contextName) {
        delete fileContent.current;
    }
    delete fileContent.store[String(contextName)];
    await saveContextFile(fileContent);
}
exports.removeContext = removeContext;
async function getCurrentContext() {
    const fileContent = await loadContextFile();
    if (await isContextFileEmpty(fileContent)) {
        throw new context_error_1.ContextFileEmptyError(exports.CONTEXT_FILE_PATH);
    }
    const context = await loadContext();
    return {
        current: fileContent.current,
        context,
    };
}
exports.getCurrentContext = getCurrentContext;
async function setCurrentContext(contextName) {
    const fileContent = await loadContextFile();
    if (await isContextFileEmpty(fileContent)) {
        throw new context_error_1.ContextFileEmptyError(exports.CONTEXT_FILE_PATH);
    }
    if (!fileContent.store[String(contextName)]) {
        throw new context_error_1.ContextNotFoundError(contextName);
    }
    fileContent.current = String(contextName);
    await saveContextFile(fileContent);
}
exports.setCurrentContext = setCurrentContext;
async function editContext(contextName, pathToFile) {
    // The expression is not wrapped in a `try...catch` block and is allowed to
    // throw automatically because it is assumed that `loadContextFile()` works
    // with a 100%-existing valid file in this case, thus if it threw anyway -
    // some REAL error happened and user should know about it.
    const fileContent = await loadContextFile();
    if (await isContextFileEmpty(fileContent)) {
        throw new context_error_1.ContextFileEmptyError(exports.CONTEXT_FILE_PATH);
    }
    fileContent.store[String(contextName)] = String(pathToFile);
    await saveContextFile(fileContent);
}
exports.editContext = editContext;
async function loadContextFile() {
    let fileContent;
    // If the context file cannot be read then it's a 'MissingContextFileError'
    // error.
    try {
        await readFile(exports.CONTEXT_FILE_PATH, { encoding: 'utf8' });
    }
    catch (e) {
        throw new context_error_1.MissingContextFileError();
    }
    // If the context file cannot be parsed then it's a
    // 'ContextFileWrongFormatError' error.
    try {
        fileContent = JSON.parse(await readFile(exports.CONTEXT_FILE_PATH, { encoding: 'utf8' }));
    }
    catch (e) {
        // https://stackoverflow.com/questions/29797946/handling-bad-json-parse-in-node-safely
        throw new context_error_1.ContextFileWrongFormatError(exports.CONTEXT_FILE_PATH);
    }
    // If the context file cannot be validated then it's a
    // 'ContextFileWrongFormatError' error.
    if (!(await isContextFileValid(fileContent))) {
        throw new context_error_1.ContextFileWrongFormatError(exports.CONTEXT_FILE_PATH);
    }
    return fileContent;
}
exports.loadContextFile = loadContextFile;
async function saveContextFile(fileContent) {
    try {
        await writeFile(exports.CONTEXT_FILE_PATH, JSON.stringify({
            current: fileContent.current,
            store: fileContent.store,
        }), { encoding: 'utf8' });
    }
    catch (e) {
        throw new context_error_1.ContextFileWriteError(exports.CONTEXT_FILE_PATH);
    }
}
async function getRepoRootPath(repoRootPath) {
    // Asynchronous `fs.exists()` is deprecated, asynchronous `fs.stat()`
    // introduces race condition, thus synchronous functions are used.
    let pathToCheck = `${repoRootPath}${path.sep}.git`;
    // If directory where `init` was requested in, happens to contain `.git`
    // directory, then it surely is a root of repository, no need to search
    // further and `REPO_ROOT_PATH` will remain as it was.
    if ((0, fs_1.existsSync)(pathToCheck) && (0, fs_1.lstatSync)(pathToCheck).isDirectory()) {
        return null;
    }
    // Directory where `init` was requested in, did not happen to contain `.git`
    // directory, so preparation for iterating through array of filesystem paths
    // is started.
    const repoRootPathArray = repoRootPath.split(path.sep);
    // Last element in array is thrown away because it is already known that it
    // does not contain directory `.git`.
    repoRootPathArray.pop();
    // Backwards search of the array of filesystem paths will now be performed.
    let i = repoRootPathArray.length - 1;
    while (i > 0) {
        pathToCheck = `${repoRootPathArray.join(path.sep)}${path.sep}.git`;
        if ((0, fs_1.existsSync)(pathToCheck) && (0, fs_1.lstatSync)(pathToCheck).isDirectory()) {
            REPO_ROOT_PATH = repoRootPathArray.join(path.sep);
            return REPO_ROOT_PATH;
        }
        // Last (`0th`) element is an empty string, so if directory `.git` was not
        // found on 1st element (last actual directory in filesystem), the search
        // does not need to continue and `REPO_ROOT_PATH` will remain having the
        // value of current (where `init` was requested in) directory.
        if (i === 1) {
            return null;
        }
        repoRootPathArray.pop();
        i--;
    }
    return null;
}
async function getContextFilePath() {
    const currentPath = process
        .cwd()
        .slice(REPO_ROOT_PATH.length + 1)
        .split(path.sep);
    currentPath.unshift(REPO_ROOT_PATH);
    for (let i = currentPath.length; i >= 0; i--) {
        const currentPathString = currentPath[0]
            ? currentPath.join(path.sep) + path.sep + CONTEXT_FILENAME
            : os.homedir() + path.sep + CONTEXT_FILENAME;
        // This `try...catch` is a part of `for` loop and is used only to swallow
        // errors if the file does not exist or cannot be read, to continue
        // uninterrupted execution of the loop.
        try {
            // If a file is found which can be read and passed validation as a
            // legitimate context file, then it is considered a legitimate context
            // file indeed.
            const fileContent = JSON.parse(
            //we do not use await readFile because getContextFilePath cannot be called inside async function
            (0, fs_1.readFileSync)(currentPathString, { encoding: 'utf8' }));
            if (fileContent &&
                (await isContextFileValid(fileContent))) {
                exports.CONTEXT_FILE_PATH = currentPathString;
                return exports.CONTEXT_FILE_PATH;
            }
        }
        catch (e) { } // eslint-disable-line
        currentPath.pop();
    }
    return null;
}
async function isContextFileValid(fileContent) {
    // Validation of context file's format against interface `IContextFile`.
    return ([1, 2].includes(Object.keys(fileContent).length) &&
        fileContent.hasOwnProperty.call(fileContent, 'store') &&
        !Array.from(Object.keys(fileContent.store)).find((elem) => typeof elem !== 'string') &&
        !Array.from(Object.values(fileContent.store)).find((elem) => typeof elem !== 'string'));
}
async function isContextFileEmpty(fileContent) {
    // If context file contains only one empty property `store` then the whole
    // context file is considered empty.
    return (fileContent &&
        Object.keys(fileContent).length === 1 &&
        Object.keys(fileContent.store).length === 0);
}
exports.isContextFileEmpty = isContextFileEmpty;
