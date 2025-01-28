import { execCommand } from "../TestUtils/GeneralUtils";
import path from "path";


jest.setTimeout(50000);

test("Python runtime testing", async () => {
//   The 'python ' command here

    const compileCommand = `cd ${path.resolve(
        __dirname,
        "./runtime-python"
    )} && python3 -m unittest discover ./tests`;
    await execCommand(compileCommand,true);
  
});