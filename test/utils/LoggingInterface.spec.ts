import { ModelLoggingInterface, Logger } from '../../src';

describe('LoggingInterface', () => {
  // eslint-disable-next-line jest/expect-expect
  test('should work when no logging interface have been defined', () => {
    Logger.setLogger(undefined);
    Logger.debug('test', {}, 'test2');
    Logger.info('test', {}, 'test2');
    Logger.warn('test', {}, 'test2');
    Logger.error('test', {}, 'test2');
  });
  describe('should log to correct level', () => {
    const debugMock = jest.fn();
    const infoMock = jest.fn();
    const warnMock = jest.fn();
    const errorMock = jest.fn();
    const mockedLogger: ModelLoggingInterface = {
      debug: debugMock,
      info: infoMock,
      warn: warnMock,
      error: errorMock
    };
    beforeAll(() => {
      Logger.setLogger(undefined);
      Logger.setLogger(mockedLogger);
    });
    beforeEach(() => {
      debugMock.mockClear();
      infoMock.mockClear();
      warnMock.mockClear();
      errorMock.mockClear();
    });
    test('debug', () => {
      Logger.debug('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(1);
      expect(debugMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
    });
    test('info', () => {
      Logger.info('test', {}, 'test2');
      expect(infoMock).toHaveBeenCalledTimes(1);
      expect(infoMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
    });
    test('warn', () => {
      Logger.warn('test', {}, 'test2');
      expect(warnMock).toHaveBeenCalledTimes(1);
      expect(warnMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
    });
    test('error', () => {
      Logger.error('test', {}, 'test2');
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(errorMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
    });
  });
  describe('should overwrite existing logger', () => {
    const oldDebugMock = jest.fn();
    const oldInfoMock = jest.fn();
    const oldWarnMock = jest.fn();
    const oldErrorMock = jest.fn();
    const oldMockedLogger: ModelLoggingInterface = {
      debug: oldDebugMock,
      info: oldInfoMock,
      warn: oldWarnMock,
      error: oldErrorMock
    };
    const debugMock = jest.fn();
    const infoMock = jest.fn();
    const warnMock = jest.fn();
    const errorMock = jest.fn();
    const mockedLogger: ModelLoggingInterface = {
      debug: debugMock,
      info: infoMock,
      warn: warnMock,
      error: errorMock
    };
    beforeAll(() => {
      Logger.setLogger(undefined);
      Logger.setLogger(oldMockedLogger);
      Logger.setLogger(mockedLogger);
    });
    beforeEach(() => {
      debugMock.mockClear();
      infoMock.mockClear();
      warnMock.mockClear();
      errorMock.mockClear();
    });
    test('debug', () => {
      Logger.debug('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(1);
      expect(debugMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
      expect(oldDebugMock).toHaveBeenCalledTimes(0);
      expect(oldInfoMock).toHaveBeenCalledTimes(0);
      expect(oldWarnMock).toHaveBeenCalledTimes(0);
      expect(oldErrorMock).toHaveBeenCalledTimes(0);
    });
    test('info', () => {
      Logger.info('test', {}, 'test2');
      expect(infoMock).toHaveBeenCalledTimes(1);
      expect(infoMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
      expect(oldDebugMock).toHaveBeenCalledTimes(0);
      expect(oldInfoMock).toHaveBeenCalledTimes(0);
      expect(oldWarnMock).toHaveBeenCalledTimes(0);
      expect(oldErrorMock).toHaveBeenCalledTimes(0);
    });
    test('warn', () => {
      Logger.warn('test', {}, 'test2');
      expect(warnMock).toHaveBeenCalledTimes(1);
      expect(warnMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(errorMock).toHaveBeenCalledTimes(0);
      expect(oldDebugMock).toHaveBeenCalledTimes(0);
      expect(oldInfoMock).toHaveBeenCalledTimes(0);
      expect(oldWarnMock).toHaveBeenCalledTimes(0);
      expect(oldErrorMock).toHaveBeenCalledTimes(0);
    });
    test('error', () => {
      Logger.error('test', {}, 'test2');
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(errorMock).toHaveBeenCalledWith('test', {}, 'test2');
      expect(debugMock).toHaveBeenCalledTimes(0);
      expect(infoMock).toHaveBeenCalledTimes(0);
      expect(warnMock).toHaveBeenCalledTimes(0);
      expect(oldDebugMock).toHaveBeenCalledTimes(0);
      expect(oldInfoMock).toHaveBeenCalledTimes(0);
      expect(oldWarnMock).toHaveBeenCalledTimes(0);
      expect(oldErrorMock).toHaveBeenCalledTimes(0);
    });
  });
});
