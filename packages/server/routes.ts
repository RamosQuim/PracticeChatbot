import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { prisma } from './index';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello, world!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, world!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
   }
   // generate SQL select query
   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });

   res.json(reviews);
});

export default router;
