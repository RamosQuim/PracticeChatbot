import { CohereClientV2 } from 'cohere-ai';
import type { ChatMessage } from 'cohere-ai/api';

// Implementation detail
const client = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

type GenerateTextOptions = {
   model?: string;
   message: any[];
   temperature?: number;
   maxTokens?: number;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'command-a-03-2025',
      message,
      temperature = 0.2,
      maxTokens = 500,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await client.chat({
         model,
         messages: message,
         temperature,
         maxTokens,
      });

      // correctly parse the response object
      const reply =
         response.message?.content
            ?.filter((item) => item.type === 'text')
            ?.map((item) => item.text)
            ?.join('') || '';

      return {
         id: response.id,
         text: reply,
      };
   },
};
