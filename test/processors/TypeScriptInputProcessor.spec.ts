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
const commonModel = processsor.process(basePath, ['Shape','InnerData', 'ShapesData']);

console.log(`Common model : ${JSON.stringify(commonModel)}`);
