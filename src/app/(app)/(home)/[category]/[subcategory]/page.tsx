import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

import { trpc, getQueryClient } from "@/trpc/server";

import { ProductListView } from "@/modules/product/ui/view/product-list-view";
import { loadProductFilters } from "@/modules/product/search-params";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  params: Promise <{
    subcategory: string;
  }>,
  searchParams: Promise<SearchParams>
};

const Page = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    category: subcategory,
    ...filters,
    limit: DEFAULT_LIMIT,
  }))

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
       <ProductListView category={subcategory}/>
      </HydrationBoundary>
    </div>
  )
}

export default Page