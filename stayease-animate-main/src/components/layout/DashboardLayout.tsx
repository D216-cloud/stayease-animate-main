import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'customer' | 'hotel-owner';
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auth gating and redirects are handled by ProtectedRoute. This layout focuses on UI only.

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-transparent">
        {/* Luxury Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-sky-400/20 to-indigo-500/20 blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
          <div className="absolute bottom-10 right-1/4 w-[22rem] h-[22rem] rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 blur-3xl animate-pulse" style={{animationDelay: '3s'}} />
        </div>

        <AppSidebar userRole={userRole} />

        <main className="flex-1 flex flex-col relative z-10">
          {/* Top Bar */}
          <header className="h-14 border-b border-border/50 bg-white/80 backdrop-blur-md flex items-center px-4 md:px-6 shadow-sm">
            <SidebarTrigger className="mr-4 hover:bg-slate-100 rounded-lg p-2 transition-colors" />
            <div className="flex-1" />
            <div className="md:hidden" />
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}