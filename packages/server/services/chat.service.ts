import { conversationRepository } from '../repositories/conversation.repository';
import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/client';

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

      // correctly parse the response object
      const reply = await llmClient.generateText({ message: conversation });

      // add assistant reply
      conversation?.push({
         role: 'assistant',
         content: reply.text,
      });

      return {
         id: reply.id,
         message: reply.text,
      };
   },
};
