import { TS_COMMON_PRESET, TS_JSONBINPACK_PRESET, TypeScriptFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

async function generateNamedExport() {
  const generator = new TypeScriptFileGenerator({});

  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-typescript/src/namedExport'
    ),
    { exportType: 'named' }
  );
}

async function generateDefaultExport() {
  const generator = new TypeScriptFileGenerator({});

  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-typescript/src/defaultExport'
      
    ),
    { exportType: 'default' }
  );
}

async function generateMarshalling() {
  const generator = new TypeScriptFileGenerator({
    presets: [
      {
        preset: TS_COMMON_PRESET,
        options: {
          marshalling: true
        }
      }
    ]
  });
  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-typescript/src/marshalling'
    ),
    { exportType: 'named' }
  );
}
async function generateJsonBinPack() {
  const generator = new TypeScriptFileGenerator({
    presets: [
      {
        preset: TS_COMMON_PRESET,
        options: {
          marshalling: true
        }
      },
      TS_JSONBINPACK_PRESET
    ]
  });
  const simplifiedInput = {
    "$id": "Address",
    "description": "This object contains all types of MetaModel generations",
    "type": "object",
    "properties": {
      "street_name": {
        "type": "string"
      },
      "house_number": {
        "type": "number"
      },
      "marriage": {
        "type": "boolean",
        "description": "Status if marriage live in given house"
      },
    },
    "required": [
      "street_name",
      "house_number",
    ]
  }
  await generator.generateToFiles(
    simplifiedInput,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-typescript/src/jsonbinpack'
    ),
    { exportType: 'named' }
  );
}

async function generateEverything() {
  await Promise.all(
    [
      generateNamedExport(),
      generateDefaultExport(),
      generateMarshalling(),
      generateJsonBinPack()
    ]
  )
}
generateEverything();