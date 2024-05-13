import path from 'path';
import { execCommand } from '../TestUtils/GeneralUtils';

jest.setTimeout(500000);

test('Rust runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-rust'
  )} && cargo test`;
  await execCommand(compileCommand);
});
