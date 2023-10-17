import { execCommand } from '../blackbox/utils/Utils';
import path from 'path';

jest.setTimeout(50000);
// eslint-disable-next-line jest/expect-expect
test('Java runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-java'
  )} && mvn test`;
  await execCommand(compileCommand);
});
