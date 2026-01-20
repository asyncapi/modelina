import { execCommand } from '../TestUtils/GeneralUtils';
import path from 'path';

jest.setTimeout(500000);

test('Scala runtime testing', async () => {
  const generateCommand = 'npm run generate:runtime:scala';
  await execCommand(generateCommand, true);
  //The 'build' command here
  const buildCommand = `cd ${path.resolve(
    __dirname,
    './runtime-scala'
  )} && ./gradlew clean build`;
  await execCommand(buildCommand, true);
  //The 'test' command here
  const testCommand = `cd ${path.resolve(
    __dirname,
    './runtime-scala'
  )} && ./gradlew test`;
  await execCommand(testCommand, true);
});
