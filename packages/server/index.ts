import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
const { CohereClientV2 } = require('cohere-ai');

dotenv.config();

const client = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

const app = express();
app.use(express.json()); // middleware function for parsing data
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, world!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, world!' });
});

const conversations: Record<string, any[]> = {};

app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, conversationId } = req.body;

      if (!conversations[conversationId]) {
         conversations[conversationId] = [];
      }

      const conversation = conversations[conversationId];

      // add user message
      conversation.push({
         role: 'user',
         content: prompt,
      });

      const response = await client.chat({
         model: 'command-a-03-2025',
         messages: conversation,
      });

      // add assistant reply
      conversation.push({
         role: 'assistant',
         content: response.message.content[0].text,
      });

      res.json({ message: response.message.content[0].text });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong.' });
   }
});

app.listen(port, () => {
   console.log(`App is listening to port ${port}`);
});
