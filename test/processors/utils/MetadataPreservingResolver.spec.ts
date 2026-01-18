import {
  createMetadataPreservingResolver,
  extractSourceFilename,
  extractSourcePath
} from '../../../src/processors/utils/MetadataPreservingResolver';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { pathToFileURL } from 'node:url';
import os from 'node:os';

describe('MetadataPreservingResolver', () => {
  const testFixturesDir = path.resolve(
    __dirname,
    '../../processors/utils/schemas'
  );
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `modelina-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {
      // Ignore cleanup errors - temp directory might already be deleted
    });
  });

  describe('Resolver configuration', () => {
    it('should have correct schema and order', () => {
      const resolver = createMetadataPreservingResolver();
      expect(resolver.schema).toBe('file');
      expect(resolver.order).toBe(-100);
    });
  });

  describe('canRead', () => {
    it('should accept file:// URIs with .yaml extension', () => {
      const resolver = createMetadataPreservingResolver();
      const uri = { toString: () => 'file:///path/to/file.yaml' } as any;
      expect(typeof resolver.canRead).toBe('function');
      const canReadFunc = resolver.canRead as (uri: any) => boolean;
      expect(canReadFunc(uri)).toBe(true);
    });

    it('should accept file:// URIs with .yml extension', () => {
      const resolver = createMetadataPreservingResolver();
      const uri = { toString: () => 'file:///path/to/file.yml' } as any;
      expect(typeof resolver.canRead).toBe('function');
      const canReadFunc = resolver.canRead as (uri: any) => boolean;
      expect(canReadFunc(uri)).toBe(true);
    });

    it('should accept file:// URIs with .json extension', () => {
      const resolver = createMetadataPreservingResolver();
      const uri = { toString: () => 'file:///path/to/file.json' } as any;
      expect(typeof resolver.canRead).toBe('function');
      const canReadFunc = resolver.canRead as (uri: any) => boolean;
      expect(canReadFunc(uri)).toBe(true);
    });

    it('should reject non-file:// URIs', () => {
      const resolver = createMetadataPreservingResolver();
      const uri = { toString: () => 'http://example.com/file.yaml' } as any;
      expect(typeof resolver.canRead).toBe('function');
      const canReadFunc = resolver.canRead as (uri: any) => boolean;
      expect(canReadFunc(uri)).toBe(false);
    });

    it('should reject file:// URIs without supported extensions', () => {
      const resolver = createMetadataPreservingResolver();
      const uri = { toString: () => 'file:///path/to/file.txt' } as any;
      expect(typeof resolver.canRead).toBe('function');
      const canReadFunc = resolver.canRead as (uri: any) => boolean;
      expect(canReadFunc(uri)).toBe(false);
    });
  });

  describe('read - YAML files', () => {
    it('should inject source file metadata', async () => {
      const resolver = createMetadataPreservingResolver();
      const filePath = path.join(testFixturesDir, 'UserPreferences.yaml');
      const uri = pathToFileURL(filePath) as any;

      const content = await resolver.read(uri);
      expect(content).toBeDefined();

      const parsed = yaml.load(content as string) as any;
      expect(parsed['x-modelgen-source-file']).toBe('UserPreferences');
      expect(parsed['x-modelgen-source-path']).toContain(
        'UserPreferences.yaml'
      );
    });

    it('should inject title if missing', async () => {
      const resolver = createMetadataPreservingResolver();
      const filePath = path.join(testFixturesDir, 'UserPreferences.yaml');
      const uri = pathToFileURL(filePath) as any;

      const content = await resolver.read(uri);
      const parsed = yaml.load(content as string) as any;

      expect(parsed.title).toBe('UserPreferences');
    });

    it('should preserve existing title', async () => {
      const tempFile = path.join(tempDir, 'WithTitle.yaml');

      await fs.writeFile(
        tempFile,
        yaml.dump({
          title: 'CustomTitle',
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        })
      );

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      const parsed = yaml.load(content as string) as any;

      expect(parsed.title).toBe('CustomTitle');
      expect(parsed['x-modelgen-source-file']).toBe('WithTitle');
    });

    it('should handle invalid YAML gracefully', async () => {
      const tempFile = path.join(tempDir, 'Invalid.yaml');
      await fs.writeFile(tempFile, 'invalid: yaml: content: [');

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      expect(content).toBeUndefined();
    });
  });

  describe('read - JSON files', () => {
    it('should inject source file metadata for JSON files', async () => {
      const tempFile = path.join(tempDir, 'TestSchema.json');
      await fs.writeFile(
        tempFile,
        JSON.stringify({
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        })
      );

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      expect(content).toBeDefined();

      const parsed = JSON.parse(content as string);
      expect(parsed['x-modelgen-source-file']).toBe('TestSchema');
      expect(parsed['x-modelgen-source-path']).toContain('TestSchema.json');
    });

    it('should inject title if missing for JSON files', async () => {
      const tempFile = path.join(tempDir, 'NoTitle.json');
      await fs.writeFile(
        tempFile,
        JSON.stringify({
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        })
      );

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      const parsed = JSON.parse(content as string);

      expect(parsed.title).toBe('NoTitle');
    });

    it('should preserve existing title for JSON files', async () => {
      const tempFile = path.join(tempDir, 'WithTitle.json');
      await fs.writeFile(
        tempFile,
        JSON.stringify({
          title: 'ExistingTitle',
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        })
      );

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      const parsed = JSON.parse(content as string);

      expect(parsed.title).toBe('ExistingTitle');
      expect(parsed['x-modelgen-source-file']).toBe('WithTitle');
    });

    it('should handle invalid JSON gracefully', async () => {
      const tempFile = path.join(tempDir, 'Invalid.json');
      await fs.writeFile(tempFile, '{ invalid json content }');

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      expect(content).toBeUndefined();
    });
  });

  describe('read - Edge cases', () => {
    it('should not inject metadata for array content', async () => {
      const tempFile = path.join(tempDir, 'ArrayContent.json');
      await fs.writeFile(tempFile, JSON.stringify([{ type: 'string' }]));

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      const parsed = JSON.parse(content as string);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed['x-modelgen-source-file']).toBeUndefined();
    });

    it('should not inject metadata for primitive content', async () => {
      const tempFile = path.join(tempDir, 'PrimitiveContent.json');
      await fs.writeFile(tempFile, JSON.stringify('string value'));

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      const parsed = JSON.parse(content as string);

      expect(typeof parsed).toBe('string');
    });

    it('should handle file not found errors', async () => {
      const resolver = createMetadataPreservingResolver();
      const nonExistentPath = path.join(tempDir, 'NonExistent.yaml');
      const uri = pathToFileURL(nonExistentPath) as any;

      const content = await resolver.read(uri);
      expect(content).toBeUndefined();
    });

    it('should handle null parsed content', async () => {
      const tempFile = path.join(tempDir, 'Null.json');
      await fs.writeFile(tempFile, 'null');

      const resolver = createMetadataPreservingResolver();
      const uri = pathToFileURL(tempFile) as any;

      const content = await resolver.read(uri);
      expect(content).toBe('null');
    });
  });

  describe('extractSourceFilename', () => {
    it('should extract source filename from schema', () => {
      const schema = {
        'x-modelgen-source-file': 'UserPreferences',
        type: 'object'
      };

      expect(extractSourceFilename(schema)).toBe('UserPreferences');
    });

    it('should return undefined for schema without metadata', () => {
      const schema = {
        type: 'object'
      };

      expect(extractSourceFilename(schema)).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      expect(extractSourceFilename(null)).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(extractSourceFilename(undefined)).toBeUndefined();
    });

    it('should return undefined for primitive input', () => {
      expect(extractSourceFilename('string')).toBeUndefined();
      expect(extractSourceFilename(123)).toBeUndefined();
      expect(extractSourceFilename(true)).toBeUndefined();
    });

    it('should return undefined for array input', () => {
      expect(extractSourceFilename([])).toBeUndefined();
    });
  });

  describe('extractSourcePath', () => {
    it('should extract source path from schema', () => {
      const schema = {
        'x-modelgen-source-path': '/path/to/UserPreferences.yaml',
        type: 'object'
      };

      expect(extractSourcePath(schema)).toBe('/path/to/UserPreferences.yaml');
    });

    it('should return undefined for schema without metadata', () => {
      const schema = {
        type: 'object'
      };

      expect(extractSourcePath(schema)).toBeUndefined();
    });

    it('should return undefined for null input', () => {
      expect(extractSourcePath(null)).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(extractSourcePath(undefined)).toBeUndefined();
    });

    it('should return undefined for primitive input', () => {
      expect(extractSourcePath('string')).toBeUndefined();
      expect(extractSourcePath(123)).toBeUndefined();
      expect(extractSourcePath(false)).toBeUndefined();
    });

    it('should return undefined for array input', () => {
      expect(extractSourcePath([1, 2, 3])).toBeUndefined();
    });
  });
});
