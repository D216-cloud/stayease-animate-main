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
import { PropertyWithStats, PropertiesAPI, BookingsAPI, Review } from "@/lib/api";
import { useEffect, useState } from "react";
import globeImage from "@/assets/globe-travel-routes.jpg";

const HotelOwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    totalGuests: 0,
    totalRevenue: "0.00",
    occupancyRate: "0",
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<{ averageRating: number; totalReviews: number }>({ averageRating: 0, totalReviews: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await BookingsAPI.getOwnerDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
        const r = await BookingsAPI.ownerRatingsSummary();
        console.log('Hotel Dashboard - ownerRatingsSummary response:', r);
        if (r.success && r.data) {
          const avgRating = r.data.averageRating || 0;
          const totalReviews = r.data.totalReviews || 0;
          console.log('Setting ratings:', { averageRating: avgRating, totalReviews });
          setRatings({ averageRating: avgRating, totalReviews });
        } else {
          console.log('No ratings data, setting defaults');
          setRatings({ averageRating: 0, totalReviews: 0 });
        }
        const reviewsResponse = await BookingsAPI.getOwnerReviews();
        if (reviewsResponse.success && reviewsResponse.data) {
          console.log('Reviews fetched:', reviewsResponse.data);
          setReviews(reviewsResponse.data);
        } else {
          console.log('No reviews response or failed:', reviewsResponse);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const [properties, setProperties] = useState<PropertyWithStats[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await PropertiesAPI.listMineWithStats();
        if (response.success && response.data) {
          setProperties(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch properties with stats", error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

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
          {/* Debug info */}
          <div className="mb-2 text-sm text-slate-600">
            Server ratings: Average {ratings.averageRating.toFixed(2)} — Total {ratings.totalReviews}
          </div>
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
                    <p className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.activeBookings}</p>
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
                    <p className="text-3xl font-bold text-slate-900">{stats.activeBookings}</p>
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
                    <p className="text-3xl font-bold text-slate-900">{stats.totalGuests}</p>
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
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-3xl font-bold text-slate-900">{ratings.averageRating.toFixed(1)}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(ratings.averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : i < ratings.averageRating
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{ratings.totalReviews} Reviews</p>
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
                    <span className="text-slate-700 font-medium">New booking at {stats.recentBookings[0]?.property.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium">Guest checked out - {stats.recentBookings[1]?.property.name}</span>
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
                      <TableRow key={property._id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Building className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-slate-900">{property.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">{property.city}, {property.country}</TableCell>
                        <TableCell>
                          <Badge
                            className={`px-3 py-1 rounded-full font-medium ${
                              (property.status || 'Inactive') === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {property.status || 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-900 font-medium">{property.guests}</TableCell>
                        <TableCell className="text-slate-900 font-medium">${property.revenue}</TableCell>
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
                <Card key={property._id} className="bg-white/95 backdrop-blur-md border-0 shadow-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{property.name}</h4>
                        <p className="text-xs text-slate-600">{property.city}, {property.country}</p>
                      </div>
                      <Badge className={(property.status || 'Inactive') === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>{property.status || 'Inactive'}</Badge>
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

          {/* Reviews Section */}
          <div className="animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">
                  Recent
                  <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Reviews
                  </span>
                </h2>
                <p className="text-slate-600">See what your guests are saying</p>
              </div>
              <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-6 py-3 hover:bg-white hover:shadow-lg transition-all">
                <Star className="w-5 h-5 mr-2" />
                View All Reviews
              </Button>
            </div>

            {/* Overall Rating Summary */}
            {loading ? (
              <Card className="p-8 text-center bg-white/95 backdrop-blur-md border-0 shadow-xl mb-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
                </div>
              </Card>
            ) : ratings.totalReviews > 0 ? (
              <Card className="group bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative mb-8">
                {/* Floating gradient orbs */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-br from-yellow-500/30 to-red-500/30 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
                
                <div className="p-8 relative z-10">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="text-6xl font-bold text-slate-900">{ratings.averageRating.toFixed(1)}</div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-8 h-8 ${
                              i < Math.floor(ratings.averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : i < ratings.averageRating
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Overall Rating</h3>
                    <p className="text-slate-600 mb-4">Based on {ratings.totalReviews} reviews across all your properties</p>
                    
                    {/* Rating Distribution */}
                    <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percentage = ratings.totalReviews > 0 ? (count / ratings.totalReviews) * 100 : 0;
                        return (
                          <div key={star} className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <span className="text-sm font-medium text-slate-700">{star}</span>
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            {reviews.length === 0 ? (
              <Card className="p-8 text-center bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Reviews Yet</h3>
                <p className="text-slate-600 mb-4">Your reviews will appear here once guests start leaving feedback.</p>
                
                {/* Sample Reviews for Demo */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Sample Reviews (Demo)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">J</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">John Doe</p>
                          <p className="text-xs text-slate-600">Grand Hotel</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-auto">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 5 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm">"Amazing experience! The staff was incredibly helpful and the room was spotless."</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">2 days ago</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">5 ⭐</Badge>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-gradient-to-r from-green-50 to-teal-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Sarah Wilson</p>
                          <p className="text-xs text-slate-600">Ocean View Resort</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-auto">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm">"Beautiful location with stunning ocean views. Breakfast was excellent!"</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">1 week ago</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">4 ⭐</Badge>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={i} className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }, (_, j) => (
                            <div key={j} className="w-4 h-4 bg-slate-200 rounded"></div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                        <div className="h-5 bg-slate-200 rounded w-12"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((review) => (
                  <Card key={review.id} className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {review.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{review.customerName}</p>
                            <p className="text-xs text-slate-600">{review.propertyName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-slate-700 mb-4 leading-relaxed">"{review.review}"</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(review.reviewedAt).toLocaleDateString()}</span>
                        <Badge 
                          className={`px-2 py-1 text-xs ${
                            review.rating >= 4 
                              ? 'bg-green-100 text-green-800' 
                              : review.rating >= 3 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {review.rating} ⭐
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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