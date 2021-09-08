import { Logger, ModelLoggingInterface } from '../../src';
import {generate} from './index';
test('Should render interface', async () => {
  const customLogger: ModelLoggingInterface = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  await generate(customLogger);
  Logger.debug('test');
  expect(customLogger.debug).toHaveBeenCalled();
  Logger.info('test');
  expect(customLogger.info).toHaveBeenCalled();
  Logger.warn('test');
  expect(customLogger.warn).toHaveBeenCalled();
  Logger.error('test');
  expect(customLogger.error).toHaveBeenCalled();
});
