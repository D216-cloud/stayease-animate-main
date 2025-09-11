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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <AppSidebar userRole={userRole} />

        <main className="flex-1 flex flex-col relative z-10">
          {/* Top Bar */}
          <header className="h-14 border-b border-border/50 bg-white/80 backdrop-blur-md flex items-center px-4 md:px-6 shadow-sm">
            <SidebarTrigger className="mr-4 hover:bg-slate-100 rounded-lg p-2 transition-colors" />
            <div className="flex-1" />
            {/* Mobile menu button - can be expanded later */}
            <div className="md:hidden">
              {/* Mobile-specific header content */}
            </div>
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