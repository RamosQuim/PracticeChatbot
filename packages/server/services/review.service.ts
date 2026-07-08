import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(product: number): Promise<string> {
      // get last 10 reviews
      // send reviews to an LLM
      const reviews = await reviewRepository.getReviews(product, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const summary = 'This is a placeholder summary.';

      return summary;
   },
};
