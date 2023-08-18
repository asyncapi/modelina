import { Parser, fromFile, fromURL } from '@asyncapi/parser';
import {
  IndentationTypes,
  JavaGenerator,
  TS_COMMON_PRESET,
  TypeScriptGenerator,
  typeScriptDefaultPropertyKeyConstraints
} from '../../src';
import path from 'path';

const generator = new TypeScriptGenerator({});
const AsyncAPIDocument = `asyncapi: 2.6.0
info:
  title: test
  version: 0.1.0

channels:
  the/publish/topic/:
    publish:
      summary: Save to persistent storage
      operationId: createTestRun
      message:
        $ref: '#/components/messages/createTestRunRequest'

components:
  messages:
    createTestRunRequest:
      title: Create TestRun Request
      summary: Add a new TestRun to persistent storage.
      description: Add a new TestRun to persistent storage
      correlationId:
        location: '$message.header#/Correlation Data'
      contentType: application/json
      payload:
        $ref: '#/components/schemas/TestRunWrite'
  schemas:
    __TestRunComponent__:
      x-parser-schema-id: TestRunComponent
      type: object
      description: This is an abstract schema, only used internally as a reference!
      properties:
        id:
          type: string
          description: The unique identifier for this test run in the storage.
        resultSet:
          $ref: '#/components/schemas/testGroup'
        objectType:
          type: string
          x-parser-schema-id: TestRunComponentObjectType
          enum:
            - TestRunWrite
            - TestRunRead
      discriminator: 'objectType'

    TestRunWrite:
      x-parser-schema-id: TestRunWrite
      description: |
        The model used to create a new TestRun. Note that this model required some ID:s to referenced resources.
      allOf:
        - $ref: '#/components/schemas/__TestRunComponent__'
        - type: object
          x-parser-schema-id: TestRunWriteExtension
          properties:
            resourceId1:
              type: string
              description: A unique identifier for the first resource.
              example: 123e4567-e89b-12d3-a456-426614174000
            resourceId12:
              type: string
              description: A unique identifier for the second resource.
              example: 123e4567-e89b-12d3-a456-426614174000
          required:
            - resourceId1
            - resourceId12

    __TestGroupComponent__:
      x-parser-schema-id: testGroupComponent
      type: object
      description: This is an abstract schema, only used internally as a reference!
      properties:
        name:
          type: string
          description: Human readable name for the test component, as displayed in the Test
            Executive sequence and report.
          example: Built-in Tests
        objectType:
          type: string
          x-parser-schema-id: testGroupComponentObjectType
          enum:
            - aggregatedTest
            - testGroup
      discriminator: 'objectType'

    testGroup:
      x-parser-schema-id: testGroup
      allOf:
        - $ref: '#/components/schemas/__TestGroupComponent__'
        - type: object
          x-parser-schema-id: testGroupExtension
          description: This is an abstract schema, only used internally as a reference!
          properties:
            id:
              type: string
              description: A unique identifier for this TestGroup in the storage.
              example: 123e4567-e89b-12d3-a456-426614174000
            testGroupComponents:
              type: array
              description: A list of sub-groups and/or sub-tests.
              items:
                $ref: '#/components/schemas/__TestGroupComponent__'

    aggregatedTest:
      x-parser-schema-id: aggregatedTest
      allOf:
        - $ref: '#/components/schemas/__TestGroupComponent__'
        - type: object
          x-parser-schema-id: aggregatedTestExtension
          description: This is an abstract schema, only used internally as a reference!
          properties:
            reference:
              type: string
              description: A UUID reference to the full Test object.
            numPassedResults:
              type: integer
              description: Number of passed test results in this test.
            numFailedResults:
              type: integer
              description: Number of failed results in this test.`;

export async function generate(): Promise<void> {
  const parser = new Parser();
  const testPath = path.resolve(__dirname, 'asyncapi.yml');
  //const { document, diagnostics } = await parser.parse(AsyncAPIDocument);

  const { document, diagnostics } = await (
    await fromFile(parser, testPath)
  ).parse();
  const models = await generator.generateCompleteModels(document, {exportType: 'named'});
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
