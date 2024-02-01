import { NextApiRequest, NextApiResponse } from 'next';
import {
  defaultAsyncapiDocument,
  GenerateMessage,
  UpdateMessage
} from '../../types';
import { decode } from 'js-base64';
import { getTypeScriptModels } from '@/pages/api/functions/TypeScriptGenerator';
import { getJavaScriptModels } from '@/pages/api/functions/JavaScriptGenerator';
import { getJavaModels } from '@/pages/api/functions/JavaGenerator';
import { getGoModels } from '@/pages/api/functions/GoGenerator';
import { getDartModels } from '@/pages/api/functions/DartGenerator';
import { getPythonModels } from '@/pages/api/functions/PythonGenerator';
import { getRustModels } from '@/pages/api/functions/RustGenerator';
import { getCSharpModels } from '@/pages/api/functions/CSharpGenerator';
import { getScalaModels } from './functions/ScalaGenerator';
import { getCplusplusModels } from './functions/CplusplusGenerator';
import { getKotlinModels } from './functions/KotlinGenerator';
import { getPhpModels } from './functions/PhpGenerator';
import { HandlerEvent } from '@netlify/functions';

export async function generateNewCode(message: GenerateMessage): Promise<UpdateMessage | Error> {
  let input: any = defaultAsyncapiDocument;
  if (message.input !== undefined) {
    const inputString: string = decode(message.input);
    input = JSON.parse(inputString);
  }

  const language: string = message.language || 'typescript';
  const props: UpdateMessage = { models: [] };
  let response: any = '';
  
  const modelGenerators: {[key: string]: Function} = {
    'typescript': getTypeScriptModels,
    'javascript': getJavaScriptModels,
    'java': getJavaModels,
    'go': getGoModels,    
    'csharp': getCSharpModels,
    'rust': getRustModels,
    'scala': getScalaModels,
    'python': getPythonModels,
    'kotlin': getKotlinModels,
    'dart': getDartModels,
    'cplusplus': getCplusplusModels,
    'php': getPhpModels
  }

  if (typeof modelGenerators[language] !== 'function') {
    return new Error('Invalid language specified');
  }

  try {
    response = await modelGenerators[language](input, message);

    if (typeof response === 'string') {
      throw new Error(response);
    }
    props.models = Array.isArray(response) ? response : [];
    
    return props;
  } catch (error : any) {
    return new Error(error.message);
  }
}

/**
 * Next specific API function, why export default is necessary. Called when running locally.
 */
export default async function generate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const message: GenerateMessage = JSON.parse(req.body);
    const response = await generateNewCode(message);
    if (Object.keys(response).includes('models') && Object.values(response).length > 0) {
      return res.status(200).json(response);
    }
    else {
      throw new Error("Input is not an correct AsyncAPI document so it cannot be processed.");
    }
  } catch (e : any) {
    console.error(e);
    return res.status(500).json({
      error: e.message
    });
  }
}

/**
 * Netlify function specific code, can be ignored in local development.
 */

export async function handler(event: HandlerEvent) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: `Method ${event.httpMethod} Not Allowed` };
  }
  if (!event.body) {
    return { statusCode: 405, body: 'Missing body' };
  }
  console.log('RUNNING____')
  try {
    const message = JSON.parse(event.body) as GenerateMessage;
    const response = await generateNewCode(message);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'There was an error generating the models'
      })
    };
  }
}