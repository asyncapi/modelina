import { generateNewCode } from "../../src/pages/api/generate";
import { GenerateMessage } from "../../src/types";
import { Handler, HandlerEvent } from "@netlify/functions";

/**
 * Netlify function specific code, can be ignored in local development.
 */

const handler: Handler = async (event: HandlerEvent) => {
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
export { handler as default };