import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

import { trpc, getQueryClient } from "@/trpc/server";

import { ProductListView } from "@/modules/product/ui/view/product-list-view";
import { loadProductFilters } from "@/modules/product/search-params";

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
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category: subcategory,
    ...filters
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