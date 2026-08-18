import { Languages, generateModels } from '../../src/helpers/generate';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from '@oclif/test';
import {buildPythonGenerator} from '../../src/helpers/python'
import {buildKotlinGenerator} from '../../src/helpers/kotlin'

const AsyncapiV3Yaml = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/asyncapi_v3.yml'),
  'utf8'
);
const AsyncapiV2Yaml = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/asyncapi_v2.yml'),
  'utf8'
);
const AsyncapiV3JSON = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/asyncapi_v3.json'),
  'utf8'
);

describe('generate models', () => {
  const logger = {
    info: (message: string) => {
    },
    debug: (message: string) => {
    },
    warn: (message: string) => {
    },
    error: (message: string) => {
    },
  }
  it('should work with AsyncAPI v2 yaml input', async () => {
    const models = await generateModels({}, AsyncapiV2Yaml, logger, Languages.typescript);
    expect(Object.keys(models).length).equal(1);
  });
  it('should work with AsyncAPI v3 yaml input', async () => {
    const models = await generateModels({}, AsyncapiV3Yaml, logger, Languages.typescript);
    expect(Object.keys(models).length).equal(1);
  });
  it('should work with AsyncAPI v3 json input', async () => {
    const models = await generateModels({}, AsyncapiV3JSON, logger, Languages.typescript);
    expect(Object.keys(models).length).equal(1);
  });

  describe('for Python', () => {
    it('should properly parse --packageName flag', async () => {
      const {fileOptions, fileGenerator} = buildPythonGenerator({packageName: 'test'});
      expect(fileOptions).to.have.property('packageName','test');
      expect(fileGenerator.options.presets.length).equal(0);
    });
    it('should properly parse --pyDantic flag', async () => {
      const {fileOptions, fileGenerator} = buildPythonGenerator({packageName: 'test', pyDantic: true});
      expect(fileOptions).to.have.property('packageName','test');
      expect(fileGenerator.options.presets.length).equal(1);
    });
  });

  describe('for Kotlin', () => {
    it('should not enable Jackson by default', async () => {
      const {fileOptions, fileGenerator} = buildKotlinGenerator({packageName: 'test'});
      expect(fileOptions).to.have.property('packageName','test');
      expect(fileGenerator.options.presets).to.have.lengthOf(0);
    });
    it('should properly parse --kotlinAllowInheritance flag', async () => {
      const {fileGenerator} = buildKotlinGenerator({
        packageName: 'test',
        kotlinAllowInheritance: true
      });
      expect(fileGenerator.options.processorOptions?.jsonSchema?.allowInheritance).equal(true);
    });
    it('should properly parse --kotlinJackson flag', async () => {
      const {fileOptions, fileGenerator} = buildKotlinGenerator({packageName: 'test', kotlinJackson: true});
      expect(fileOptions).to.have.property('packageName','test');
      expect(fileGenerator.options.presets).to.have.lengthOf(1);
    });
    it('should properly parse --kotlinIgnoreAdditionalProperties flag', async () => {
      const {fileGenerator} = buildKotlinGenerator({
        packageName: 'test',
        kotlinIgnoreAdditionalProperties: true
      });
      expect(fileGenerator.options.processorOptions?.jsonSchema?.ignoreAdditionalProperties).equal(true);
    });
    it('should properly parse --kotlinIncludeComponentSchemas flag', async () => {
      const {fileGenerator} = buildKotlinGenerator({
        packageName: 'test',
        kotlinIncludeComponentSchemas: true
      });
      expect(fileGenerator.options.processorOptions?.asyncapi?.includeComponentSchemas).equal(true);
    });
    it('should properly parse --kotlinRequiredPropertiesFirst flag', async () => {
      const {fileGenerator} = buildKotlinGenerator({
        packageName: 'test',
        kotlinRequiredPropertiesFirst: true
      });
      expect(fileGenerator.options.requiredPropertiesFirst).equal(true);
    });
    it('should apply --kotlinTypeMapping values', async () => {
      const {fileGenerator} = buildKotlinGenerator({
        packageName: 'test',
        kotlinTypeMapping: [
          'uuid=java.util.UUID',
          'instant=java.time.Instant'
        ]
      });
      const models = await fileGenerator.generate({
        $id: 'MappedTypes',
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'instant' },
          name: { type: 'string' }
        }
      });

      expect(models[0].result).to.contain('val id: java.util.UUID?');
      expect(models[0].result).to.contain('val createdAt: java.time.Instant?');
      expect(models[0].result).to.contain('val name: String?');
    });
    it('should reject malformed --kotlinTypeMapping values', async () => {
      expect(() => buildKotlinGenerator({
        packageName: 'test',
        kotlinTypeMapping: ['uuid']
      })).to.throw("Invalid Kotlin type mapping 'uuid'. Expected FORMAT=KOTLIN_TYPE.");
    });
  });
});
