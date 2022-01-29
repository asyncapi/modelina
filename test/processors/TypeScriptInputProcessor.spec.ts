import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { TypeScriptInputProcessor } from '../../src/processors';

// const basicDocDirectory = fs.readFileSync(path.resolve(__dirname, './TypeScriptInputProcessor'), 'utf8');
const basePath = path.resolve(__dirname, './TypeScriptInputProcessor');
// jest.mock('../../src/interpreter/Interpreter');
// jest.mock('../../src/interpreter/PostInterpreter');
// jest.mock('../../src/utils/LoggingInterface');

// const mockedReturnModels = [new CommonModel()];
// jest.mock('../../src/interpreter/Interpreter', () => {
//   return {
//     Interpreter: jest.fn().mockImplementation(() => {
//       return {
//         interpret: jest.fn().mockImplementation(() => {return mockedReturnModels[0];})
//       };
//     })
//   };
// });
// jest.mock('../../src/interpreter/PostInterpreter', () => {
//   return {
//     postInterpretModel: jest.fn().mockImplementation(() => {return mockedReturnModels;})
//   };
// });

const processsor = new TypeScriptInputProcessor();
console.log(basePath);
const input = {
  basePath,
  types: ['Shape','InnerData', 'ShapesData'],
} as Record<string, any>;

processsor.process({
  input,
}).then((commonModel) => console.log(`Common model : ${JSON.stringify(commonModel)}`));

