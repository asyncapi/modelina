const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate} from './index';
import * as fs from 'fs';
import * as path from 'path';
describe('Should be able to generate models to files', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    const expectedRootDir = __dirname.includes('examples') ? __dirname : path.resolve(__dirname, './examples/generate-to-files');
    const expectedFilePath = path.resolve(expectedRootDir, 'Root.java');
    await generate();
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(spy.mock.calls[spy.mock.calls.length-1]).toMatchSnapshot();
    expect(fs.existsSync(expectedFilePath));
  });
});
