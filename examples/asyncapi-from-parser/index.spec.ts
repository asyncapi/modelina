import {generate} from './index';

describe('Should be able to process AsyncAPI object from parser', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  test('and should log expected output to console', async () => {
    const callbackMock = jest.fn();
    await generate(callbackMock);
    const expectedConsoleLog = `export interface AnonymousSchema_1 {
  email?: string;
}`;
    expect(callbackMock).toBeCalledWith(expectedConsoleLog);
  });
});
