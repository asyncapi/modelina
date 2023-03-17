import { NextApiRequest, NextApiResponse } from 'next';
import { HandlerEvent } from '@netlify/functions';
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

export async function generateNewCode(message: GenerateMessage) {
  let input: any = defaultAsyncapiDocument;
  if (message.input !== undefined) {
    const inputString = decode(message.input);
    // const jsonSafe = inputString.replace(/'/g, '"');
    // const jsonEnsuredQutoation = jsonSafe.replace(/(['"])?([a-zA-Z0-9_$-]+)(['"])?:([^\/])/g, '"$2":$4');
    input = JSON.parse(inputString);
  }

  const language = message.language || 'typescript';
  const props: UpdateMessage = { models: [] };
  switch (language) {
    case 'typescript':
      props.models = await getTypeScriptModels(input, message);
      break;
    case 'javascript':
      props.models = await getJavaScriptModels(input, message);
      break;
    case 'java':
      props.models = await getJavaModels(input, message);
      break;
    case 'go':
      props.models = await getGoModels(input, message);
      break;
    case 'csharp':
      props.models = await getCSharpModels(input, message);
      break;
    case 'rust':
      props.models = await getRustModels(input, message);
      break;
    case 'python':
      props.models = await getPythonModels(input, message);
      break;
    case 'dart':
      props.models = await getDartModels(input, message);
      break;
    default:
      break;
  }
  return props;
}

async function generate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const message: GenerateMessage = JSON.parse(req.body);
    const response = await generateNewCode(message);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: 'There was an error generating the models'
    });
  }
}

export default generate;

/**
 * Netlify function specifi code, can be ignored in local development
 */
export async function handler(event: HandlerEvent) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: `Method ${event.httpMethod} Not Allowed` };
  }
  if (!event.body) {
    return { statusCode: 405, body: 'Missing body' };
  }
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
