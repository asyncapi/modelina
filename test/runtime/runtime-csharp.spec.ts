import { execCommand } from '../blackbox/utils/Utils';
import path from 'path';

jest.setTimeout(50000);

test('C# runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-csharp'
  )} && dotnet test runtime-csharp`;
  await execCommand(compileCommand);
});
