import {  createTRPCRouter } from '../init';

import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/product/server/procedures';
import { tagsRouter } from '@/modules/tags/server/procedures';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
  products: productsRouter,
  tags: tagsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;