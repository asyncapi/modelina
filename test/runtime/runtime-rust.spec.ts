import path from 'path';
import { execCommand } from '../blackbox/utils/Utils';

jest.setTimeout(100000);

test('Rust runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-rust'
  )} && cargo test`;
  await execCommand(compileCommand);
});
