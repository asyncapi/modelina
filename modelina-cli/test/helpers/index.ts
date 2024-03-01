import { existsSync, writeFileSync, unlinkSync,rmdirSync, mkdirSync , promises as fs } from 'fs';
import * as path from 'path';
import { IContextFile, CONTEXT_FILE_PATH } from '../../src/models/Context';
import SpecificationFile from '../../src/models/SpecificationFile';
import http from 'http';
import rimraf from 'rimraf';

const ASYNCAPI_FILE_PATH = path.resolve(process.cwd(), 'specification.yaml');
const SERVER_DIRECTORY= path.join(__dirname, '../fixtures/dummyspec');
export const PROJECT_DIRECTORY_PATH = path.join(process.cwd(), 'test-project');

let server: http.Server;

export default class ContextTestingHelper {
  private _context: IContextFile;
  constructor() {
    const homeSpecFile = new SpecificationFile(path.resolve(__dirname, '../fixtures/specification.yml'));

    const codeSpecFile = new SpecificationFile(path.resolve(__dirname, '../fixtures/specification.yml'));
    this._context = {
      current: 'home',
      store: {
        home: homeSpecFile.getPath(),
        code: codeSpecFile.getPath()
      }
    };
  }

  get context(): IContextFile {
    return this._context;
  }

  createDummyContextFile(): void {
    writeFileSync(CONTEXT_FILE_PATH, JSON.stringify(this._context), { encoding: 'utf8' });
  }

  createDummyContextFileWrong(data: string): void {
    writeFileSync(CONTEXT_FILE_PATH, JSON.stringify(data));
  }

  deleteDummyContextFile(): void {
    if (existsSync(CONTEXT_FILE_PATH)) {
      unlinkSync(CONTEXT_FILE_PATH);
    }
  }

  unsetCurrentContext(): void {
    delete this._context.current;
  }

  setCurrentContext(context: string): void {
    this._context.current = context;
  }

  getPath(key: string): string | undefined {
    return this._context.store[String(key)];
  }

  createSpecFileAtWorkingDir(): void {
    if (!existsSync(ASYNCAPI_FILE_PATH)) {
      writeFileSync(ASYNCAPI_FILE_PATH, '');
    }
  }

  deleteSpecFileAtWorkingDir(): void {
    if (existsSync(ASYNCAPI_FILE_PATH)) {
      unlinkSync(ASYNCAPI_FILE_PATH);
    }
  }

  newCommandHelper() {
    return {
      deleteSpecFile: () => {
        const specificationFilePath = path.resolve(process.cwd(), 'specification.yaml');
        if (existsSync(specificationFilePath)) {
          unlinkSync(specificationFilePath);
        }
      }
    };
  }

  createDummyProjectDirectory(): void {
    mkdirSync(PROJECT_DIRECTORY_PATH);
  }

  deleteDummyProjectDirectory(): void {
    rimraf.sync(PROJECT_DIRECTORY_PATH);
  }
}

export function fileCleanup(filepath: string) {
  unlinkSync(filepath);
}

export function createMockServer (port = 8080) {
  server = http.createServer(async (req,res) => {
    if (req.method ==='GET') {
      const filePath= path.join(SERVER_DIRECTORY, req.url || '/');
      try {
        const content = await fs.readFile(filePath, {encoding: 'utf8'});
        res.writeHead(200, {'Content-Type': getContentType(filePath)});
        res.end(content);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 NOT FOUND');
        } else {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      }
    }
  });
  server.listen(port);
}

export function stopMockServer() {
  server.close();
}

function getContentType(filePath:string):string {
  const extname = path.extname(filePath);
  switch (extname) {
  case '.json':
    return 'application/json';
  case '.yml':
  case '.yaml':
    return 'application/yaml';
  default:
    // Any other suggestion?
    return 'application/octet-stream';
  }
}
