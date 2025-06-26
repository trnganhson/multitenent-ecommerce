"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useProductFilter } from "../../hooks/use-product-filter";

interface Props {
    category?: string;
}
 
export const ProductList = ({ category, }: Props) => {
    const [filters] = useProductFilter()

    const trpc = useTRPC()
    const  {data} = useSuspenseQuery(trpc.products.getMany.queryOptions({
        category,
        ...filters,
    }))

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {data?.docs.map((product)=>(
                <div key={product.id} className="border p-4 rounded-md bg-white">
                    <h2 className="text-xl font-medium">{product.name}</h2>
                    <h2>${product.price}</h2>
                </div>
            ))}
        </div>
    )
}

export const ProductListSkeleton = () => {
    return(
        <div>
            Loading...
        </div>
    )
}