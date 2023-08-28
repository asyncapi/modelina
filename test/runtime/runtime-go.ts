import {GoFileGenerator, GO_DEFAULT_PRESET} from "../../src";
import path from "path";
import input from "./generic-input.json";


const generator = new GoFileGenerator({
    presets : [GO_DEFAULT_PRESET],

})

generator.generateToFiles(
    input,
    path.resolve(__dirname,'./runtime-go'),
    {packageName : "runtimego"}
)