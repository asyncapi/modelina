import {generate} from './index';

describe('Should be able to render typescript interface', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  test('and should log expected output to console', async () => {
    const callbackMock = jest.fn();
    await generate(callbackMock);
    expect(callbackMock).toMatchSnapshot();
  });
});
