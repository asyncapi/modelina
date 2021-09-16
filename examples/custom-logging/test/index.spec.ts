import { Logger, ModelLoggingInterface } from '../../../lib';
import {generate} from '../index';

describe('Should be able to use custom logging interface', () => {

  afterAll(() => {
    jest.clearAllMocks();
  });
  
  test('and should log expected output to console', async () => {
    const callbackMock = jest.fn();
    const customLogger: ModelLoggingInterface = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    Logger.setLogger(customLogger);

    await generate(callbackMock);
    const expectedConsoleLog = `export interface Root {
  email?: string;
}`;
    expect(callbackMock).toBeCalledWith(expectedConsoleLog);

  });
});
