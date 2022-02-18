const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate} from './index';

describe(`Should be able to generate Java models from a TypeScript type file 
along with specific options`, () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //GenerateWithOptions is called 4x, so even though we expect 1 model, we double it
    expect(spy.mock.calls.length).toEqual(4);
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});

