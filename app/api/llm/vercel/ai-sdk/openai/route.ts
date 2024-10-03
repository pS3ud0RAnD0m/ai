import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Get a language model
  const model = openai("gpt-4o");

  // Call the language model with the prompt
  const result = await streamText({
    model,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
    topP: 1,
  });

  // Respond with a streaming response
  return result.toAIStreamResponse();
}
