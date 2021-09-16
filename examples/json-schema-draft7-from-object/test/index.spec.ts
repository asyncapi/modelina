import {generate} from '../index';

describe('Should be able to process JSON Schema draft 7 object', () => {

  afterAll(() => {
    jest.clearAllMocks();
  });
  test('and should log expected output to console', async () => {
    const callbackMock = jest.fn();
    await generate(callbackMock);
    const expectedConsoleLog = `export interface Root {
  email?: string;
}`;
    expect(callbackMock).toBeCalledWith(expectedConsoleLog);
  });
});
