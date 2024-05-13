import { execCommand } from '../TestUtils/GeneralUtils';
import path from 'path';

jest.setTimeout(50000);

test('Kotlin runtime testing', async () => {
  //The 'build' command here
  const buildCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew build`;
  await execCommand(buildCommand);
  //The 'test' command here
  const testCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew test`;
  await execCommand(testCommand);
});
