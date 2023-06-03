import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line no-undef
const currentDirPath = __dirname;
const outputDir = path.resolve(
  currentDirPath,
  './runtime-kotlin/src/test/kotlin'
);

// Define the TypeScript code as a string template
const typescriptCode = `
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Address @JsonCreator constructor(
    @JsonProperty("street_name") val streetName: String,
    @JsonProperty("house_number") val houseNumber: Int,
    @JsonProperty("marriage") val marriage: Boolean,
    @JsonProperty("members") val members: Any?,
    @JsonProperty("array_type") val arrayType: List<Any>,
    @JsonProperty("nestedObject") val nestedObject: NestedObject
) {
    data class NestedObject @JsonCreator constructor(
        @JsonProperty("test") val test: String
    )
}
`;

// Create the output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Write the TypeScript code to a file
fs.writeFileSync(path.join(outputDir, 'Address.kt'), typescriptCode);
