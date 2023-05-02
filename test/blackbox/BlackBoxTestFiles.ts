import * as path from 'path';
import * as fs from 'fs';

/**
 * Read all the files in the folder, and return the appropriate Jest `each` entries.
 * @param folder
 */
function readFilesInFolder(folder: string) {
  // eslint-disable-next-line no-undef
  const fullPath = path.resolve(__dirname, `./docs/${folder}`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return fs.readdirSync(fullPath).map((file) => {
    return {
      file: `./docs/${folder}/${file}`,
      outputDirectory: `./output/${folder}/${path.parse(file).name}`
    };
  });
}

const Swagger2Files = readFilesInFolder('Swagger-2_0');
const OpenAPI3_0Files = readFilesInFolder('OpenAPI-3_0');
const jsonSchemaDraft7Files = readFilesInFolder('JsonSchemaDraft-7');
const jsonSchemaDraft6Files = readFilesInFolder('JsonSchemaDraft-6');
const jsonSchemaDraft4Files = readFilesInFolder('JsonSchemaDraft-4');
const AsyncAPIV2_0Files = readFilesInFolder('AsyncAPI-2_0');
const AsyncAPIV2_1Files = readFilesInFolder('AsyncAPI-2_1');
const AsyncAPIV2_2Files = readFilesInFolder('AsyncAPI-2_2');
const AsyncAPIV2_3Files = readFilesInFolder('AsyncAPI-2_3');
const AsyncAPIV2_4Files = readFilesInFolder('AsyncAPI-2_4');
const AsyncAPIV2_5Files = readFilesInFolder('AsyncAPI-2_5');
const AsyncAPIV2_6Files = readFilesInFolder('AsyncAPI-2_6');

const filesToTest = [
  ...Swagger2Files,
  ...OpenAPI3_0Files.filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used to locally test stuff.
    return !file.includes('postman-api.json');
  }).filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used to locally test stuff.
    return !file.includes('twilio-1_13.json');
  }),
  ...AsyncAPIV2_0Files.filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used to locally test stuff.
    return !file.includes('zbos_mqtt-all-asyncapi.json');
  }),
  ...AsyncAPIV2_1Files,
  ...AsyncAPIV2_2Files,
  ...AsyncAPIV2_3Files,
  ...AsyncAPIV2_4Files,
  ...AsyncAPIV2_5Files,
  ...AsyncAPIV2_6Files,
  ...jsonSchemaDraft4Files.filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used lto ocally test stuff.
    return !file.includes('aws-cloudformation.json');
  }),
  ...jsonSchemaDraft7Files.filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used to locally test stuff.
    return !file.includes('graphql-code-generator.json');
  }),
  ...jsonSchemaDraft6Files.filter(({ file }) => {
    // Too large to process in normal blackbox testing, can be used to locally test stuff.
    return !file.includes('fhir-full.json');
  })
];

/**
 * Officially only use one specific file for each input type, and the rest is for local testing.
 *
 * Otherwise the CI system will take far too long.
 */
export default filesToTest.filter(({ file }) => {
  return (
    file.includes('AsyncAPI-2_0/dummy.json') ||
    file.includes('AsyncAPI-2_1/dummy.json') ||
    file.includes('AsyncAPI-2_2/dummy.json') ||
    file.includes('AsyncAPI-2_3/dummy.json') ||
    file.includes('AsyncAPI-2_4/dummy.json') ||
    file.includes('AsyncAPI-2_5/streetlight_kafka.json') ||
    file.includes('AsyncAPI-2_6/dummy.json') ||
    file.includes('JsonSchemaDraft-4/draft-4-core.json') ||
    file.includes('JsonSchemaDraft-6/draft-6-core.json') ||
    file.includes('JsonSchemaDraft-7/draft-7-core.json') ||
    file.includes('OpenAPI-3_0/petstore.json') ||
    file.includes('Swagger-2_0/petstore.json')
  );
});
