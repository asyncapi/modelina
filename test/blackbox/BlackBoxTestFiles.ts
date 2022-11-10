import * as path from 'path';
import * as fs from 'fs';

/**
 * Read all the files in the folder, and return the appropriate Jest `each` entries.
 * @param folder 
 */
function readFilesInFolder(folder: string) {
    const fullPath = path.resolve(__dirname, `./docs/${folder}`);
    return fs.readdirSync(fullPath).map(
        (file) => {
            return { file: `./docs/${folder}/${file}`, outputDirectory: `./output/${folder}/${path.parse(file).name}` };
        }
    );
}

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

const filesToTest = [
    ...OpenAPI3_0Files.filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('postman-api.json');
    }).filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('twilio-1_13.json');
    }),
    ...AsyncAPIV2_0Files.filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('zbos_mqtt-all-asyncapi.json');
    }),
    ...AsyncAPIV2_1Files,
    ...AsyncAPIV2_2Files,
    ...AsyncAPIV2_3Files,
    ...AsyncAPIV2_4Files,
    ...AsyncAPIV2_5Files,
    ...jsonSchemaDraft4Files.filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('aws-cloudformation.json');
    }),
    ...jsonSchemaDraft7Files.filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('graphql-code-generator.json');
    }),
    ...jsonSchemaDraft6Files.filter(({ file }) => {
        // Too large to process in normal blackbox testing, can be used locally test stuff.
        return !file.includes('fhir-full.json');
    }),
];
export default filesToTest;