const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to generate Kotlin models with Jackson support', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('and should log the annotated models to console', async () => {
    await generate();
    expect(spy.mock.calls).toHaveLength(1);
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});
