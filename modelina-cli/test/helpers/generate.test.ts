import { Languages, generateModels } from '../../src/helpers/generate';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from '@oclif/test';
import {buildPythonGenerator} from '../../src/helpers/python'
import {buildJavaGenerator} from '../../src/helpers/java'

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

  describe('for Java', () => {
    it('should default to the javax namespace', async () => {
      const { fileGenerator } = buildJavaGenerator({
        packageName: 'test',
        javaArrayType: 'Array',
        javaConstraints: true
      });
      const models = await fileGenerator.generateCompleteModels(AsyncapiV3Yaml, {
        packageName: 'test'
      });
      expect(models[0].result).to.include('javax.validation');
    });

    it('should properly parse --javaJakarta flag', async () => {
      const { fileGenerator } = buildJavaGenerator({
        packageName: 'test',
        javaArrayType: 'Array',
        javaConstraints: true,
        javaJakarta: true
      });
      const models = await fileGenerator.generateCompleteModels(AsyncapiV3Yaml, {
        packageName: 'test'
      });
      expect(models[0].result).to.include('jakarta.validation');
      expect(models[0].result).to.not.include('javax.validation');
    });
  });
});
