import { CohereClientV2 } from 'cohere-ai';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import fs from 'fs';
import path from 'path';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);

// Implementation detail
const client = new CohereClientV2({
   token: process.env.LLM_API_KEY,
});

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }

      // get last 10 reviews
      // send reviews to an LLM
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = [
         {
            role: 'user',
            content: template.replace('{{reviews}}', joinedReviews),
         },
      ];

      const { text: summary } = await llmClient.generateText({
         message: prompt,
      });
      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
