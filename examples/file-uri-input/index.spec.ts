const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate, generateToFiles } from './index';

describe('Should be able to render models using file URI as input', () => {
  describe('with regular generator', () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('and should log expected output to console', async () => {
      await generate();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('with file generator', () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('and should log expected output to console', async () => {
      await generateToFiles();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0]).toMatchSnapshot();
    });
  });
});
