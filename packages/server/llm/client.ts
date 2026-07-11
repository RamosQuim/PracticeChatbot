import { CohereClientV2 } from 'cohere-ai';
import type { ChatMessage } from 'cohere-ai/api';
import { InferenceClient } from '@huggingface/inference';
import { readFileSync } from 'fs';

const summarizePrompt = readFileSync(
   new URL('../llm/prompts/summarize-reviews.txt', import.meta.url),
   'utf-8'
);

// Implementation detail
const cohereClient = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

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
      const response = await cohereClient.chat({
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

   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },
};
