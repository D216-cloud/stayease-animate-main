import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarInput,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Search,
  Calendar,
  Heart,
  User,
  Settings,
  LogOut,
  Building,
  BarChart3,
  Users,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import luxLogo from "@/assets/luxstay-logo.svg";

interface AppSidebarProps {
  userRole: 'customer' | 'hotel-owner';
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
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

  const customerItems = [
    { title: "Home", url: "/dashboard/customer", icon: Home, iconColor: "text-blue-600" },
    { title: "Search Hotels", url: "/dashboard/customer/search", icon: Search, iconColor: "text-green-600" },
    { title: "My Bookings", url: "/dashboard/customer/bookings", icon: Calendar, iconColor: "text-purple-600" },
    { title: "Wishlist", url: "/dashboard/customer/wishlist", icon: Heart, iconColor: "text-red-600" },
  ];

  const hotelOwnerItems = [
    { title: "Home", url: "/dashboard/hotel-owner", icon: Home, iconColor: "text-blue-600" },
    { title: "Properties", url: "/dashboard/hotel-owner/properties", icon: Building, iconColor: "text-green-600" },
    { title: "Bookings", url: "/dashboard/hotel-owner/bookings", icon: Calendar, iconColor: "text-purple-600" },
    { title: "Analytics", url: "/dashboard/hotel-owner/analytics", icon: BarChart3, iconColor: "text-orange-600" },
    { title: "Ratings", url: "/dashboard/hotel-owner/ratings", icon: Star, iconColor: "text-amber-600" },
    { title: "Guests", url: "/dashboard/hotel-owner/guests", icon: Users, iconColor: "text-pink-600" },
  ];

  const items = userRole === 'customer' ? customerItems : hotelOwnerItems;
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Thanks for using StayEase!",
    });
    navigate('/');
  };

  const userEmail = user?.email || (userRole === 'customer' ? 'customer@example.com' : 'owner@example.com');
  const userName = user ? `${user.first_name} ${user.last_name}`.trim() : (userRole === 'customer' ? 'Customer' : 'Hotel Owner');

  return (
    <Sidebar
      className="border-r border-slate-200 bg-white/95 backdrop-blur-md"
      style={{ width: isMobile ? '280px' : '280px' }}
    >
      {/* Header with Enhanced Logo */}
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <img src={luxLogo} alt="LuxStay" className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-xl transition-all" />
            <div className="absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-30 transition-all" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              LuxStay
            </span>
            <div className="text-xs text-slate-500 font-medium">Premium Stays</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-4">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700 text-sm font-semibold px-2 mb-3 uppercase tracking-wide">
            {userRole === 'customer' ? 'Customer Portal' : 'Owner Portal'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-700 hover:bg-slate-100 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : item.iconColor}`} />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-slate-700 text-sm font-semibold px-2 mb-3 uppercase tracking-wide">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              {userRole === 'customer' ? (
                <Button size="sm" className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="h-4 w-4 mr-3" />
                  Quick Search
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="w-full justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/dashboard/hotel-owner/add-property')}
                >
                  <Building className="h-4 w-4 mr-3" />
                  Add Property
                </Button>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile at Bottom */}
      <SidebarFooter className="p-4 border-t border-slate-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-slate-100 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-slate-200 group-hover:ring-blue-300 transition-all">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white border-slate-200 shadow-xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-600">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-slate-100 cursor-pointer text-slate-700">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-100 cursor-pointer text-slate-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}