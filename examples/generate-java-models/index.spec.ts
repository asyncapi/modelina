const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import {generate} from '../generate-dart-models';

describe('Should be able to render Java Models', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});
