import { PYTHON_JSON_SERIALIZER_PRESET,PythonFileGenerator } from "../../";
import path from "path";

import input from "./generic-input.json";

const generator = new PythonFileGenerator({
    presets: [PYTHON_JSON_SERIALIZER_PRESET],
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



