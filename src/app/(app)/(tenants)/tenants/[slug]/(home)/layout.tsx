import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton/>}>
          <Navbar slug={slug}/>
        </Suspense>
      </HydrationBoundary>
        <div className="flex-1">
          <div className="max-w-(--breakpoint-xl) max-auto">{children}</div>
        </div>
        <Footer />
    </div>
  );
};

export default Layout;
