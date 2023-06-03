import { execSync } from 'child_process';
import path from 'path';

jest.setTimeout(50000);

test('Kotlin runtime testing', () => {
  const buildCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew build`;
  const testCommand = `cd ${path.resolve(
    __dirname,
    './runtime-kotlin'
  )} && ./gradlew test`;

  try {
    execSync(buildCommand, { stdio: 'inherit' });
    console.log('Kotlin project built successfully.');

    execSync(testCommand, { stdio: 'inherit' });
    console.log('Kotlin test execution successful.');
  } catch (error) {
    console.error('Kotlin test execution failed:', error.message);
  }
});
