import {generate} from './index';
test('Should be able to process JSON Schema draft 7 object', async () => {
  const models = await generate();
  expect(models).not.toBeUndefined();
  expect(models).not.toHaveLength(0);
});
