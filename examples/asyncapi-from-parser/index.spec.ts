import {generate} from './index';
test('Should be able to process AsyncAPI object from parser', async () => {
  const models = await generate();
  expect(models).not.toBeUndefined();
  expect(models).not.toHaveLength(0);
});
