import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
    const { slug } = await params;

    return (
        <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
            <Navbar slug={slug} />
            <div className="flex-1">
                <div className="max-w-(--breakpoint-xl) max-auto">{children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
