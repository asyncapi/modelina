const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate} from './index';

describe('Should be able to render Go Enums', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //Generate is called 2x, so even though we expect 4 model (root and three different enums type), we double it
    expect(spy.mock.calls.length).toEqual(8);
    expect(spy.mock.calls[1]).toMatchSnapshot();
    expect(spy.mock.calls[2]).toMatchSnapshot();
    expect(spy.mock.calls[3]).toMatchSnapshot();
  });
});
