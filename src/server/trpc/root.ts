import {
  createCallerFactory,
  createTRPCRouter,
} from "~/server/trpc/main";
import { scrapeArticle } from "~/server/trpc/procedures/scrapeArticle";

export const appRouter = createTRPCRouter({
  scrapeArticle,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
