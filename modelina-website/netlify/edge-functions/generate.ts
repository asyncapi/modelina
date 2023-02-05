import type { Config, Context } from "netlify:edge";
import {generateNewCode} from '../../src/pages/api/generate';
import { GenerateMessage } from "@/types";

export default async function handler(req: Request, context: Context) {
  const body = await req.json();
  try {
    const message: GenerateMessage = body
    const response = await generateNewCode(message);
    return new Response(context.json(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch(e) {
    console.error(e);
    return new Response(context.json({
      error: 'There was an error generating the models'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config: Config = { path: "/api/generate" }
