import { CohereClientV2 } from 'cohere-ai';
import { conversationRepository } from '../repositories/conversation.repository';
import fs from 'fs';
import path from 'path';

// Implementation detail
const client = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'chatbot.txt'),
   'utf-8'
);
const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

// Public interface
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      if (!conversationRepository.getConversationId(conversationId)) {
         conversationRepository.setConversationId(conversationId, [
            {
               role: 'system',
               content: instructions,
            },
         ]);
      }

      const conversation =
         conversationRepository.getConversationId(conversationId);

      // add user message
      conversation?.push({
         role: 'user',
         content: prompt,
      });

      const response = await client.chat({
         model: 'command-a-03-2025',
         messages: conversation,
      });

      // correctly parse the response object
      const reply =
         response.message?.content
            ?.filter((item) => item.type === 'text')
            ?.map((item) => item.text)
            ?.join('') || '';

      // add assistant reply
      conversation?.push({
         role: 'assistant',
         content: reply,
      });

      return {
         id: response.id,
         message: reply,
      };
   },
};
