import { prisma } from '..';

export const productRepository = {
   getProduct(productId: number) {
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};
