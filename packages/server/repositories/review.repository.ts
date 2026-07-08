import { prisma } from '..';
import type { Review } from '../generated/prisma/browser';

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      // generate SQL select query
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },
};
