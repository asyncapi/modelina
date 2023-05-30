import {
  FileHelpers,
  DartFileGenerator,
  OutputModel,
  ConstrainedAnyModel,
  InputMetaModel,
  GoFileGenerator,
  JavaFileGenerator,
  JavaScriptFileGenerator,
  TypeScriptFileGenerator,
  CSharpFileGenerator,
  RustFileGenerator,
  PythonFileGenerator,
  KotlinFileGenerator,
  PhpFileGenerator,
  CplusplusFileGenerator
} from '../../src';
import * as path from 'path';

const generatorsToTest = [
  {
    generator: new GoFileGenerator(),
    generatorOptions: { packageName: 'some_package' },
    fileExtension: 'go'
  },
  {
    generator: new DartFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' },
    fileExtension: 'dart'
  },
  {
    generator: new JavaFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' },
    fileExtension: 'java'
  },
  {
    generator: new JavaScriptFileGenerator(),
    generatorOptions: {},
    fileExtension: 'js'
  },
  {
    generator: new TypeScriptFileGenerator(),
    generatorOptions: {},
    fileExtension: 'ts'
  },
  {
    generator: new CSharpFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' },
    fileExtension: 'cs'
  },
  {
    generator: new RustFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' },
    fileExtension: 'rs'
  },
  {
    generator: new PythonFileGenerator(),
    generatorOptions: {},
    fileExtension: 'py'
  },
  {
    generator: new KotlinFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' },
    fileExtension: 'kt'
  },
  {
    generator: new PhpFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' },
    fileExtension: 'php'
  },
  {
    generator: new CplusplusFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' },
    fileExtension: 'hpp'
  }
];

describe.each(generatorsToTest)(
  'generateToFiles',
  ({ generator, generatorOptions, fileExtension }) => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const doc = {
      $id: 'CustomClass',
      type: 'object',
      additionalProperties: true,
      properties: {
        someProp: { type: 'string' },
        someEnum: {
          $id: 'CustomEnum',
          type: 'string',
          enum: ['Texas', 'Alabama', 'California']
        }
      }
    };

    test('should throw accurate error if file cannot be written', async () => {
      const expectedError = new Error('write error');
      jest
        .spyOn(FileHelpers, 'writerToFileSystem')
        .mockRejectedValue(expectedError);
      jest
        .spyOn(generator, 'generateCompleteModels')
        .mockResolvedValue([
          new OutputModel(
            'content',
            new ConstrainedAnyModel('', undefined, ''),
            'test',
            new InputMetaModel(),
            []
          )
        ]);

      await expect(
        generator.generateToFiles(doc, '/test/', generatorOptions as any)
      ).rejects.toEqual(expectedError);
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
    });
    test('should try and generate models to files', async () => {
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      const expectedOutputFilePath = path.resolve(
        `${outputDir}/test.${fileExtension}`
      );
      const expectedWriteToFileParameters = [
        'content',
        expectedOutputFilePath,
        false
      ];
      jest
        .spyOn(FileHelpers, 'writerToFileSystem')
        .mockResolvedValue(undefined);
      jest
        .spyOn(generator, 'generateCompleteModels')
        .mockResolvedValue([
          new OutputModel(
            'content',
            new ConstrainedAnyModel('', undefined, ''),
            'test',
            new InputMetaModel(),
            []
          )
        ]);

      await generator.generateToFiles(
        doc,
        expectedOutputDirPath,
        generatorOptions as any
      );
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
      expect(
        (FileHelpers.writerToFileSystem as jest.Mock).mock.calls[0]
      ).toEqual(expectedWriteToFileParameters);
    });
    test('should ignore models that have not been rendered', async () => {
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      jest
        .spyOn(FileHelpers, 'writerToFileSystem')
        .mockResolvedValue(undefined);
      jest
        .spyOn(generator, 'generateCompleteModels')
        .mockResolvedValue([
          new OutputModel(
            '',
            new ConstrainedAnyModel('', undefined, ''),
            '',
            new InputMetaModel(),
            []
          )
        ]);

      const models = await generator.generateToFiles(
        doc,
        expectedOutputDirPath,
        generatorOptions as any
      );
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(models).toHaveLength(0);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(0);
    });
  }
);
