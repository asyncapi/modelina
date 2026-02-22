import path from 'path';
import { execCommand } from '../TestUtils/GeneralUtils';

jest.setTimeout(500000);

test('Rust runtime testing', async () => {
  const cargoPath = process.env.CARGO || 'cargo';

  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-rust'
  )} && ${cargoPath} test`;

  await execCommand(compileCommand, true);
});
