import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { trpc, getQueryClient } from "@/trpc/server";

import { 
  ProductList, 
  ProductListSkeleton, 
} from "@/modules/product/ui/components/products-list";

interface Props {
  params: Promise <{
    category: string;
  }>
};

const Page = async ({ params }: Props) => {
  const { category } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category
  }))

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton/>}>
          <ProductList category={category}/>
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default Page