import { execCommand } from '../TestUtils/GeneralUtils';
import path from 'path';

jest.setTimeout(500000);

test('Kotlin runtime testing', async () => {
  const generateCommand = 'npm run generate:runtime:kotlin';
  await execCommand(generateCommand, true);
  //The 'build' command here
  const buildCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew build`;
  await execCommand(buildCommand, true);
  //The 'test' command here
  const testCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew test`;
  await execCommand(testCommand, true);
});
