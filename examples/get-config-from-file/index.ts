import { FileHelpers, TypeScriptOptions } from '../../src';

async function main() {
  try {
    const config: { config: TypeScriptOptions } =
      await FileHelpers.getConfigFromFile('./modelina.config.j');
    console.log(config.config);
  } catch (err) {
    console.log(err);
  }
}

main();
