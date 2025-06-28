import z from "zod"

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Media, Tenant } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
  .input(
    z.object({
      slug: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const tenantsData = await ctx.db.find({
      collection: "tenants",
      depth: 1, //"tenant.image" is a type of "Media"
      where: {
        slug: {
            equals: input.slug,
        }
      },
      limit: 1,
      pagination: false,  
    });

    const tenant = tenantsData.docs[0]

    if(!tenant) {
        throw new TRPCError({code: "NOT_FOUND", message: "Tenant not found"})
    }

    return tenant as Tenant & {image: Media | null } 
  }),
});
