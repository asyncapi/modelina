import {GoFileGenerator} from "../../src";
import path from "path";
import input from "./generic-input.json";


// Note: GO_DEFAULT_PRESET is applied automatically as the generator's default
// preset. Passing it explicitly here double-registers it with `undefined`
// options, which crashes the union `field` preset (options.unionAnyModelName)
// once a union field resolves to `interface{}`/`map`/`[]` - now exercised by
// the nullable union-array coverage. Relying on the built-in default avoids the
// duplicate registration with no change to generated output.
const generator = new GoFileGenerator({})

generator.generateToFiles(
    input,
    path.resolve(__dirname,'./runtime-go'),
    {packageName : "runtimego"}
)