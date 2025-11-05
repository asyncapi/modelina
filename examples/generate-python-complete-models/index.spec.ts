import { generate } from './index';

const createLogMock = () =>
  jest.spyOn(global.console, 'log').mockImplementation(() => {
    return;
  });

describe('Should be able to render python models', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    const spy = createLogMock();

    await generate();

    expect(spy.mock.calls.length).toEqual(2);

    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});
