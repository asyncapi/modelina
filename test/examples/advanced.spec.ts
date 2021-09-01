import { Logger, ModelLoggingInterface } from '../../src';

describe('Advanced (./docs/advanced.md)', () => {
  test('Adding logging to the library', () => {
    const customLogger: ModelLoggingInterface = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    Logger.setLogger(customLogger);
    Logger.debug('test');
    expect(customLogger.debug).toHaveBeenNthCalledWith(1, 'test');
    Logger.info('test');
    expect(customLogger.info).toHaveBeenNthCalledWith(1, 'test');
    Logger.warn('test');
    expect(customLogger.warn).toHaveBeenNthCalledWith(1, 'test');
    Logger.error('test');
    expect(customLogger.error).toHaveBeenNthCalledWith(1, 'test');
  });
});
