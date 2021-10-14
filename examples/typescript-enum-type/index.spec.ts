const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import { generate } from './index';
function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
describe('Should be able to render correct enums based on options', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async function testIt(): Promise<void> {
    // Wait for first call to the `generate` function is over, and we can reliably know the output
    if (spy.mock.calls.length !== 6) {
      await timeout(50);
      return testIt();
    }

    await generate();
    //Generate is called 2 times, so even though we expect 6 console logs we double it
    expect(spy.mock.calls.length).toEqual(12);
    const generatedContent = spy.mock.calls.slice(6).join('\n');
    expect(generatedContent).toMatchSnapshot();
  });
});

