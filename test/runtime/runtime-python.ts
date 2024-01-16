import { PYTHON_DEFAULT_PRESET,PythonFileGenerator } from "../../";
import path from "path";

import input from "./generic-input.json";

const generator = new PythonFileGenerator({
    presets: [PYTHON_DEFAULT_PRESET],
    
});

generator.generateToFiles(
    input,
    path.resolve(
        // eslint-disable-next-line no-undef
        __dirname,
        "./runtime-python/test/main/"
    ),
    {}
);



