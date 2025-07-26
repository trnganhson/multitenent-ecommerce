import z from "zod"
import type { Where, Sort } from "payload";
import {headers as getHeaders} from "next/headers"

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Media, Tenant } from "@/payload-types";

import { sortValue } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query( async ({ctx, input})=> {
    const headers = await getHeaders()

    const session = await ctx.db.auth({ headers})

    const product = await ctx.db.findByID({
      collection: "products",
      id: input.id,
      depth: 2, //Load the"product.image", "product.tenant" and "product.tenant.image"
      select: {
        content: false,
      }
    })

    let isPurchased = false

    if(session.user) {
      const ordersData = await ctx.db.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [ 
            {
              product: {
                equals: input.id,
              }
            },
            {
              user: { 
                equals: session.user.id,
              }
            },
          ]
        }
      })

      isPurchased = !!ordersData.docs[0]
    }

    const reviews = await ctx.db.find({
      collection: "reviews",
      pagination: false,
      where: {
        product: {
          equals: input.id
        }
      }
    })

    const reviewRating = 
    reviews.docs.length > 0
    ? reviews.docs.reduce((acc, review) => acc +  review.rating,0) / reviews.totalDocs
    : 0 

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }

    if(reviews.totalDocs > 0) {
      reviews.docs.forEach((review) => {
        const rating = review.rating
        if(rating >= 1 && rating <= 5) {
          ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
        }
      })

      Object.keys(ratingDistribution).forEach((key) => {
        const rating = Number(key)
        const count = ratingDistribution[rating] || 0
        ratingDistribution[rating] = Math.round(count / reviews.totalDocs) * 100
      })
    }

    return {
      ...product,
      isPurchased,
      image: product.image as Media | null,
      tenant: product.tenant as Tenant & {image: Media | null},
      reviewRating,
      reviewCount: reviews.totalDocs,
      ratingDistribution,
    }
  })
  ,
  getMany: baseProcedure
  .input(
    z.object({
      cursor: z.number().default(1),
      limit: z.number().default(DEFAULT_LIMIT),
      category: z.string().nullable().optional(),
      minPrice: z.string().nullable().optional(),
      maxPrice: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      sort: z.enum(sortValue).nullable().optional(),
      tenantSlug: z.string().nullable().optional()
    })
  )
  .query(async ({ ctx, input }) => {
    const where: Where = {}
    let sort: Sort = "-createdAt"

    if(input.sort === "curated") {
      sort = "-createAt"
    }

    if(input.sort === "hot_and_new") {
      sort = "+createAt"
    }
    
    if(input.sort === "trending") {
      sort = "-createAt"
    }

    if(input.minPrice && input.maxPrice) {
      where.price = {
        less_than_equal: input.maxPrice,
        greater_than_equal: input.minPrice
      }
    }else if(input.minPrice) {
      where.price = {
        greater_than_equal: input.minPrice
      }
    } else if (input.maxPrice) {
      where.price = {
        ...where.price,
        less_than_equal: input.maxPrice
      }
    }

    if(input.tenantSlug){
      // Get tenant by slug first
      const tenantData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      })

      const tenant = tenantData.docs[0]

      if(tenant) {
        where.tenant = {
          equals: tenant.id
        }
      }
    } 

    if(input.category) {
      const categoriesData = await ctx.db.find({
        collection: "categories",
        limit: 1,
        depth: 1, //Populate subcategories, subcategories.[0] will be a type og "Category"
        pagination: false,
        where: {
          slug: {
            equals: input.category,
          }
        }
      })

      const formattedData = categoriesData.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      //Because of "depth: 1" we are confident "doc" will be a type of "Category"
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));

      const subcategoriesSlugs = []
      const parentCategory = formattedData[0]

      if(parentCategory) {
        subcategoriesSlugs.push(
          ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
        )
        
        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategoriesSlugs]
        }
      }
    }

    if(input.tags && input.tags.length > 0) {
      where["tag.name"] = {
        in: input.tags
      }
    }

    const data = await ctx.db.find({
      collection: "products",
      depth: 2, //Populate "category", "image", "tenant" & "tenant.image"
      where,
      sort,
      page: input.cursor,
      limit: input.limit,
      select: {
        content: false
      }
    });

    const datawithSummarizedReviews = await Promise.all(
      data.docs.map(async (doc )=> {
        const reviewsData = await ctx.db.find({
          collection: "reviews",
          pagination: false,
          where: {
            product: {
              equals: doc.id,
            }
          }
        })

        return {
          ...doc,
          reviewCount: reviewsData.totalDocs,
          reviewRating:
            reviewsData.docs.length === 0
            ? 0
            : reviewsData.docs.reduce((acc,review)=> acc + review.rating, 0) / reviewsData.totalDocs
        }
      })
    )

    return {
      ...data,
      docs: datawithSummarizedReviews.map((doc)=>({
         ...doc,
        image: doc.image as Media | null,
        tenant: doc.tenant as  Tenant & { image: Media | null },
      }))
    }
  }),
});
