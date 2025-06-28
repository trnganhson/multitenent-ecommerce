import type { SearchParams } from "nuqs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { trpc, getQueryClient } from "@/trpc/server";

import { loadProductFilters } from "@/modules/product/search-params";
import { ProductListView } from "@/modules/product/ui/view/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  params: Promise<{
    category: string;
  }>,
  searchParams: Promise<SearchParams>
};

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    category,
    ...filters,
    limit: DEFAULT_LIMIT
  }))

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
       <ProductListView category={category}/>
      </HydrationBoundary>
    </div>
  )
}

export default Page