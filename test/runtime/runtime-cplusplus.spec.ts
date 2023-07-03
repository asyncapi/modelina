import { execCommand } from '../blackbox/utils/Utils';
import path from 'path';

jest.setTimeout(50000);

test('C++ runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-cplusplus/src'
  )} && git submodule update --init && c++ -std=c++17 -o AddressTest.out AddressTest.cpp && ./AddressTest.out`;
  await execCommand(compileCommand);
});
