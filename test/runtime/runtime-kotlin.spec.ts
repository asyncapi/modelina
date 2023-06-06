import { execCommand } from '../blackbox/utils/Utils';
import path from 'path';

jest.setTimeout(50000);

test('Kotlin runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew test`;
  await execCommand(compileCommand);
});
