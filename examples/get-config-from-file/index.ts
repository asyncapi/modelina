import { FileHelpers, TypeScriptOptions } from '../../src';

async function main() {
  const config: { config: TypeScriptOptions } =
    await FileHelpers.getConfigFromFile('./modelina.config.js');
  console.log(config.config);
}

main();
