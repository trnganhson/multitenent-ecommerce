"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useProductFilter } from "../../hooks/use-product-filter"

export const ProductSort = () => {
    const [filters, setFilters] = useProductFilter()

    return(
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                className={cn("rounded-full bg-white hover:bg-white",
                    filters.sort !== "curated" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
                )}
                variant="secondary"
                onClick={()=>setFilters({sort: "curated"})}
            >
                Cureted 
            </Button>
            <Button
                size="sm"
                className={cn("rounded-full bg-white hover:bg-white",
                    filters.sort !== "trending" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
                )}
                variant="secondary"
                onClick={()=>setFilters({sort: "trending"})}
            >
                Trending
            </Button>
            <Button
                size="sm"
                className={cn("rounded-full bg-white hover:bg-white",
                    filters.sort !== "hot_and_new" && "bg-transparent border-transparent hover:border-border hover:bg-transparent"
                )}
                variant="secondary"
                onClick={()=>setFilters({sort: "hot_and_new"})}
            >
                Hot & New
            </Button>
        </div>
    )
}