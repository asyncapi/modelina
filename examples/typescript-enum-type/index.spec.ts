const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
describe('Should be able to render correct enums based on options', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async (): Promise<void> => {
    await generate();
    expect(spy.mock.calls.length).toEqual(6);
    const generatedContent = spy.mock.calls.join('\n');
    expect(generatedContent).toMatchSnapshot();
  });
});
