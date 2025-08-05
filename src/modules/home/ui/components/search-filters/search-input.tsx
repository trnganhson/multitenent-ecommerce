"use client"

import { useEffect, useState } from "react";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";


import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CategoriesSidebar } from "./categories-sidebar";
import { useProductFilter } from "@/modules/product/hooks/use-product-filter";

interface Props {
    disabled?: boolean;
}

export const SearchInput = ({
    disabled,
}:Props)=>{
    const[filters,setFilters] = useProductFilter()
    const [searchValue,setSearchValue] = useState(filters.search)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const trpc = useTRPC()
    const session = useQuery(trpc.auth.session.queryOptions())

    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            setFilters({search: searchValue})
        },500)
        return ()=> clearTimeout(timeoutId)
    },[setFilters,searchValue])

    return(
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input 
                    className="p-8" 
                    placeholder="Search products" 
                    disabled={disabled}
                    value={searchValue}
                    onChange={(e)=> setSearchValue(e.target.value)}
                />
            </div>
            {/* TODO: Add categories view all button*/}
            <Button
            variant="elevated"
            className="size-12 shrink-0 flex lg:hidden"
            onClick={()=> setIsSidebarOpen(true)}
            >
                <ListFilterIcon/>
            </Button>
            {session.data?.user && (
                <Button
                    asChild
                    variant="elevated"
                >
                    <Link href="/library">
                        <BookmarkCheckIcon/>
                        Library 
                    </Link>
                </Button>
            )}
            {/* TODO: Add library button */}
        </div>
    )
}