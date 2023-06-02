import * as fs from 'fs';
import * as path from 'path';

const currentDirPath = __dirname;
const outputDir = path.resolve(
  currentDirPath,
  './runtime-kotlin/src/test/kotlin'
);
const packageName = 'com.mycompany.app';

// Define the Kotlin code as a string template
const kotlinCode = `
package ${packageName}

class MyClass {
    val message: String = "Hello, Kotlin!"
  
    fun printMessage(name: String) {
        println("Hello, " + name)
    }
}
`;

// Create the output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Write the Kotlin code to a file
fs.writeFileSync(path.join(outputDir, 'MyClass.kt'), kotlinCode);
