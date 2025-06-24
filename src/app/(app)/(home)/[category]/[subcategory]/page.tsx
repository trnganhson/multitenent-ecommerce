import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { trpc, getQueryClient } from "@/trpc/server";

import { 
  ProductList, 
  ProductListSkeleton, 
} from "@/modules/product/ui/components/products-list";

interface Props {
  params: Promise <{
    subcategory: string;
  }>
};

const Page = async ({ params }: Props) => {
  const { subcategory } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category: subcategory,
  }))

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton/>}>
          <ProductList category={subcategory}/>
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default Page