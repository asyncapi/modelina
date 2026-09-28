import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptGenerator } from '../../src';

const baseFile = path.resolve(
  __dirname,
  './TypeScriptInputProcessor/enums-and-generics.ts'
);
const fileContents = fs.readFileSync(baseFile, 'utf-8');

async function generate(): Promise<string[]> {
  const generator = new TypeScriptGenerator();
  const models = await generator.generate({ fileContents, baseFile });
  return models.map((model) => model.result).sort((a, b) => a.localeCompare(b));
}

describe('TypeScriptInputProcessor end-to-end', () => {
  test('should generate models for a file containing enums and generics', async () => {
    expect(await generate()).toMatchSnapshot();
  });

  test('should preserve declaration order of TypeScript enum members', async () => {
    const rendered = await generate();
    const enumModel = rendered.find((model) =>
      model.startsWith('enum ReservedStatus')
    );

    expect(enumModel).toBeDefined();
    expect(
      [...(enumModel as string).matchAll(/^\s+(\w+) = /gm)].map(
        (match) => match[1]
      )
    ).toEqual(['X', 'Y', 'NUMBER_123']);
  });

  test('should not leak URI encoded generic references into generated models', async () => {
    const rendered = await generate();
    const shipment = rendered.find((model) =>
      model.startsWith('class Shipment')
    );

    expect(shipment).toBeDefined();
    expect(shipment).not.toContain('%3C');
    expect(shipment).not.toContain('%3E');
  });
});
