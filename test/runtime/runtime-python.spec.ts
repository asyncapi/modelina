import { execCommand } from "../TestUtils/GeneralUtils";
import path from "path";


jest.setTimeout(50000);

test("Python runtime testing", async () => {
//   The 'python ' command here

    const compileCommand = `cd ${path.resolve(
        __dirname,
        "./runtime-python/test/"
    )} && python3 main.py`;
    await execCommand(compileCommand,true);
  
});