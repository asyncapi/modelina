import { Languages, generateModels } from '../../src/helpers/generate';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from '@oclif/test';

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
    expect(models[0].modelName).equal('UserSignedUpPayload');
  });
  it('should work with AsyncAPI v3 yaml input', async () => {
    const models = await generateModels({}, AsyncapiV3Yaml, logger, Languages.typescript);
    expect(Object.keys(models).length).equal(1);
    expect(models[0].modelName).equal('UserSignedUpPayload');
  });
  it('should work with AsyncAPI v3 json input', async () => {
    const models = await generateModels({}, AsyncapiV3JSON, logger, Languages.typescript);
    expect(Object.keys(models).length).equal(1);
    expect(models[0].modelName).equal('UserSignedUpPayload');
  });
});