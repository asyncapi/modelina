const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';
const describeWithRamlParser = (() => {
  try {
    require.resolve('@asyncapi/raml-dt-schema-parser');
    return describe;
  } catch {
    return describe.skip;
  }
})();

describeWithRamlParser(
  'Should be able to process an AsyncAPI object with RAML schema type',
  () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('and should log expected output to console', async () => {
      await generate();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0]).toMatchSnapshot();
    });
  }
);
