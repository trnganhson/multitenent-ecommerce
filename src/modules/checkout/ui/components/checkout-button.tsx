import { Button } from "@/components/ui/button"
import { useCart } from "../../hooks/use-cart"
import { cn, generateTenantURL } from "@/lib/utils"
import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

interface CheckoutButtonProps {
    className?: string
    hideIfEmpty?: boolean
    tenantSlug: string
}

export const CheckoutButton = ({
    className,
    hideIfEmpty,
    tenantSlug,
}: CheckoutButtonProps ) => {
    const { totalItems } = useCart(tenantSlug)

    if(hideIfEmpty && totalItems===0) return null

    return(
        <Button variant="elevated" asChild className={cn("bg-white", className)}>
            <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
                <ShoppingCartIcon/> {totalItems > 0 ? totalItems : ""}
            </Link>
        </Button>
    )
}