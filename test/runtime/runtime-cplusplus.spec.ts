import { execCommand } from '../TestUtils/GeneralUtils';
import path from 'path';

jest.setTimeout(50000);

test('C++ runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-cplusplus/src'
  )} && c++ -std=c++17 -o AddressTest.out AddressTest.cpp && ./AddressTest.out`;
  await execCommand(compileCommand);
});
