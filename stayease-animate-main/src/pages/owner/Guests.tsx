import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Search, Star, Phone, Mail, MapPin } from "lucide-react";

const Guests = () => {
  const guests = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8890",
      totalBookings: 3,
      totalSpent: 2450,
      avgRating: 4.8,
      status: "VIP",
      lastVisit: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson", 
      email: "sarah@example.com",
      phone: "+1 234 567 8891",
      totalBookings: 1,
      totalSpent: 599,
      avgRating: 5.0,
      status: "New",
      lastVisit: "2024-01-10"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 234 567 8892",
      totalBookings: 5,
      totalSpent: 4200,
      avgRating: 4.9,
      status: "VIP",
      lastVisit: "2024-01-18"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 234 567 8893",
      totalBookings: 2,
      totalSpent: 1200,
      avgRating: 4.7,
      status: "Regular",
      lastVisit: "2024-01-12"
    }
  ];

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Enhanced Hero Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Guests
              </h1>
            </div>
            <p className="text-slate-600">Manage your guest relationships</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{guests.length}</p>
                  <p className="text-sm text-slate-600">Total Guests</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">4.8</p>
                  <p className="text-sm text-slate-600">Avg. Rating</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">4</p>
                  <p className="text-sm text-slate-600">VIP Guests</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">11</p>
                  <p className="text-sm text-slate-600">Total Bookings</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search guests..." 
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400"
          />
        </div>

        <div className="grid gap-4">
          {guests.map((guest) => (
            <Card key={guest.id} className="bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 ring-2 ring-slate-100 group-hover:ring-purple-300 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">{guest.name}</h3>
                    <p className="text-sm text-slate-500">{guest.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-slate-600">{guest.totalBookings} bookings</span>
                      <span className="text-sm text-slate-600">${guest.totalSpent} spent</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-slate-600">{guest.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={
                      guest.status === 'VIP' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0' 
                        : guest.status === 'New'
                        ? 'bg-green-100 text-green-800 border-0'
                        : 'bg-slate-100 text-slate-800 border-0'
                    }
                  >
                    {guest.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Guests;