import { generate } from './index';

const createLogMock = () =>
  jest.spyOn(global.console, 'log').mockImplementation(() => {
    return;
  });

describe('Should be able to render python models', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('and should generate `implicit` or `explicit` imports for models implementing referenced types', async () => {
    const spy = createLogMock();

    await generate();

    expect(spy.mock.calls.length).toEqual(4);

    expect(spy.mock.calls[0]).toMatchSnapshot('root-model-implicit-import');
    expect(spy.mock.calls[1]).toMatchSnapshot('nested-model');

    expect(spy.mock.calls[2]).toMatchSnapshot('root-model-explicit-import');
    expect(spy.mock.calls[3]).toMatchSnapshot('nested-model');
  });
});
