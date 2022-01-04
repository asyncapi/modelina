const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate} from './index';

describe('Should be able to render models to ESM module system', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //Generate is called 2x, so even though we expect 2 models, we double it
    expect(spy.mock.calls.length).toEqual(4);
    expect(spy.mock.calls[1]).toMatchSnapshot();
    expect(spy.mock.calls[2]).toMatchSnapshot();
  });
});
