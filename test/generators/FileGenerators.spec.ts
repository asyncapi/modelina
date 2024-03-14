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
    generatorOptions: { packageName: 'some_package' }
  },
  {
    generator: new DartFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' }
  },
  {
    generator: new JavaFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' }
  },
  {
    generator: new JavaScriptFileGenerator(),
    generatorOptions: {}
  },
  {
    generator: new TypeScriptFileGenerator(),
    generatorOptions: {}
  },
  {
    generator: new CSharpFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' }
  },
  {
    generator: new RustFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' }
  },
  {
    generator: new PythonFileGenerator(),
    generatorOptions: {}
  },
  {
    generator: new KotlinFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' }
  },
  {
    generator: new PhpFileGenerator(),
    generatorOptions: { packageName: 'SomePackage' }
  },
  {
    generator: new CplusplusFileGenerator(),
    generatorOptions: { namespace: 'SomeNamespace' }
  }
];

describe.each(generatorsToTest)(
  'generateToFiles',
  ({ generator, generatorOptions }) => {
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
            new ConstrainedAnyModel('', undefined, {}, ''),
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
    test.only('should try and generate models to files', async () => {
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      jest
        .spyOn(FileHelpers, 'writerToFileSystem')
        .mockResolvedValue(undefined);
      jest
        .spyOn(generator, 'generateCompleteModels')
        .mockResolvedValue([
          new OutputModel(
            'content',
            new ConstrainedAnyModel('', undefined, {}, ''),
            'TestModel',
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
        (FileHelpers.writerToFileSystem as jest.Mock).mock.calls.at(0).at(0)
      ).toEqual('content');
      const filePath: string = (
        FileHelpers.writerToFileSystem as jest.Mock
      ).mock.calls
        .at(0)
        .at(1);
      expect(filePath).toMatch(expectedOutputDirPath);
      expect(filePath.replace(expectedOutputDirPath, '')).toMatchSnapshot();
      expect(
        (FileHelpers.writerToFileSystem as jest.Mock).mock.calls.at(0).at(2)
      ).toEqual(false);
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
            new ConstrainedAnyModel('', undefined, {}, ''),
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
