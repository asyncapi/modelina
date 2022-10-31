import {generate} from './index';

const createLogMock = () => jest.spyOn(global.console, 'log').mockImplementation(() => { return; });

describe('Should be able to render python models', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('and should generate `implicit` imports for models implementing referenced types', async () => {
    const spy = createLogMock();

    await generate({
      importsStyle: 'implicit'
    });

    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[0]).toMatchSnapshot('root-model');
    expect(spy.mock.calls[1]).toMatchSnapshot('nested-model');
  });
  test('and should generate `explicit` imports for models implementing referenced types', async () => {
    const spy = createLogMock();

    await generate({
      importsStyle: 'explicit'
    });

    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[0]).toMatchSnapshot('root-model');
    expect(spy.mock.calls[1]).toMatchSnapshot('nested-model');
  });
});
