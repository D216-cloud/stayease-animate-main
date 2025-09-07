import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  Calendar, 
  Users, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight,
  Building,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import globeImage from "@/assets/globe-travel-routes.jpg";
import hotelImage from "@/assets/hotel-construction.jpg";

const HotelOwnerDashboard = () => {
  const properties = [
    {
      id: 1,
      name: "Royal Inn",
      location: "Paris, France",
      status: "Active",
      guests: 200,
      revenue: "$15,200",
      occupancy: 85
    },
    {
      id: 2,
      name: "Beach Resort",
      location: "Maldives",
      status: "Pending",
      guests: 150,
      revenue: "$12,800",
      occupancy: 72
    },
  ];

  return (
    <DashboardLayout userRole="hotel-owner">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl p-12 text-center animate-fade-in relative overflow-hidden">
            {/* Floating gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />

            <div className="max-w-4xl mx-auto relative z-10">
              {/* Globe with Travel Routes */}
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 animate-bounce-in relative group">
                <img
                  src={globeImage}
                  alt="Global travel routes and connections"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all" />
              </div>

              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Welcome to Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Travel Hub
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Find, book, and enjoy your next trip with AI-powered recommendations and personalized experiences
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mb-8">
                <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                <Input
                  placeholder="Search hotels, destinations, or dates..."
                  className="pl-12 pr-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl shadow-lg focus:shadow-xl transition-all"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { icon: Sparkles, text: "AI Recommendations", color: "from-blue-600 to-purple-600" },
                  { icon: Zap, text: "Instant Booking", color: "from-purple-600 to-pink-600" },
                  { icon: Shield, text: "Secure Payments", color: "from-emerald-600 to-teal-600" }
                ].map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl px-6 py-3 hover:bg-white hover:shadow-lg transition-all group"
                  >
                    <action.icon className={`w-5 h-5 mr-2 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">2</p>
                    <p className="text-sm text-slate-600">Total Properties</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">5</p>
                    <p className="text-sm text-slate-600">Active Bookings</p>
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">350</p>
                    <p className="text-sm text-slate-600">Total Guests</p>
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
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">78%</p>
                    <p className="text-sm text-slate-600">Occupancy Rate</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Button className="w-full justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                    <Building className="w-5 h-5 mr-3" />
                    Add New Property
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                    <Users className="w-5 h-5 mr-3" />
                    Manage Guests
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                    <BarChart3 className="w-5 h-5 mr-3" />
                    View Reports
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium">New booking at Royal Inn</span>
                    <span className="text-xs text-slate-500 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium">Guest checked out - Beach Resort</span>
                    <span className="text-xs text-slate-500 ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium">5-star review received</span>
                    <span className="text-xs text-slate-500 ml-auto">1d ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Properties Table */}
          <div className="animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">
                  Your
                  <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Properties
                  </span>
                </h2>
                <p className="text-slate-600">Manage all your properties in one place</p>
              </div>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                <Building className="w-5 h-5 mr-2" />
                Add Property
              </Button>
            </div>
            
            {/* Desktop table */}
            <div className="md:block hidden">
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50">
                      <TableHead className="font-bold text-slate-900">Property</TableHead>
                      <TableHead className="font-bold text-slate-900">Location</TableHead>
                      <TableHead className="font-bold text-slate-900">Status</TableHead>
                      <TableHead className="font-bold text-slate-900">Guests</TableHead>
                      <TableHead className="font-bold text-slate-900">Revenue</TableHead>
                      <TableHead className="font-bold text-slate-900">Occupancy</TableHead>
                      <TableHead className="font-bold text-slate-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Building className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-slate-900">{property.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">{property.location}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`px-3 py-1 rounded-full font-medium ${
                              property.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-900 font-medium">{property.guests}</TableCell>
                        <TableCell className="text-slate-900 font-medium">{property.revenue}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${property.occupancy}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">{property.occupancy}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-slate-200/50">
                              <DropdownMenuItem className="text-slate-700 cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Property
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-4">
              {properties.map(property => (
                <Card key={property.id} className="bg-white/95 backdrop-blur-md border-0 shadow-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{property.name}</h4>
                        <p className="text-xs text-slate-600">{property.location}</p>
                      </div>
                      <Badge className={property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>{property.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>Guests: <span className="font-medium text-slate-900">{property.guests}</span></div>
                      <div>Revenue: <span className="font-medium text-slate-900">{property.revenue}</span></div>
                      <div>Occupancy: <span className="font-medium text-slate-900">{property.occupancy}%</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button className="flex-1" variant="outline">Manage</Button>
                      <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">View</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Revenue Overview</h3>
                <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all">
                  View Report
                </Button>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">📊</div>
                  <p className="text-slate-600">Revenue chart will be displayed here</p>
                  <p className="text-sm text-slate-500">Last 6 months performance</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HotelOwnerDashboard;