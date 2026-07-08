import { CohereClientV2 } from 'cohere-ai';
import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';

// Implementation detail
const client = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(product: number): Promise<string> {
      // get last 10 reviews
      // send reviews to an LLM
      const reviews = await reviewRepository.getReviews(product, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = [
         {
            role: 'user',
            content: `
        Summarize the following customer reviews into a short paragraph
        highlighting key themes, both positive and negative:

        ${joinedReviews}`,
         },
      ];

      const response = await client.chat({
         model: 'command-a-03-2025',
         temperature: 0.2,
         maxTokens: 500,
         messages: prompt,
      });

      // correctly parse the response object
      const reply =
         response.message?.content
            ?.filter((item) => item.type === 'text')
            ?.map((item) => item.text)
            ?.join('') || '';

      return reply;
   },
};
