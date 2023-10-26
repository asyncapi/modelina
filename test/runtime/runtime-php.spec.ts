import { execCommand } from '../blackbox/utils/Utils';
import path from 'path';

jest.setTimeout(50000);

test('PHP runtime testing', async () => {
  const compileCommand = `cd ${path.resolve(
    __dirname,
    './runtime-php'
  )} && composer install --no-interaction --quiet && composer test`;
  await execCommand(compileCommand);
});
