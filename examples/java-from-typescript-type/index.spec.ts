const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate, generateWithOptions} from './index';

describe('Should be able to generate Java model from a TypeScript type file', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //Generate is called 6x, so even though we expect 1 model, we double it
    expect(spy.mock.calls.length).toEqual(6);
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});

describe(`Should be able to generate Java models from a TypeScript type file 
along with specific options`, () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generateWithOptions();
    //GenerateWithOptions is called 6x, so even though we expect 1 model, we double it
    expect(spy.mock.calls.length).toEqual(6);
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});
