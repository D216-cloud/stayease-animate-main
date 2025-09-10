import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Star, Heart, Calendar, Users, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import globeImage from "@/assets/globe-travel-routes.jpg";
import hotelImage from "@/assets/hotel-construction.jpg";
import { BookingsAPI, PropertiesAPI, type Booking, type Property } from "@/lib/api";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState({ bookings: false, recommended: false });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(prev => ({ ...prev, bookings: true }));
      try {
        const res = await BookingsAPI.listMine();
        if (!ignore && res.success && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } finally {
        if (!ignore) setLoading(prev => ({ ...prev, bookings: false }));
      }
    };
    const loadRecommended = async () => {
      setLoading(prev => ({ ...prev, recommended: true }));
      try {
        const res = await PropertiesAPI.listPublic({ page: 1, limit: 6 });
        if (!ignore && res.success && Array.isArray(res.data)) {
          setRecommended(res.data.slice(0, 6));
        }
      } finally {
        if (!ignore) setLoading(prev => ({ ...prev, recommended: false }));
      }
    };
    load();
    loadRecommended();
    return () => { ignore = true; };
  }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return bookings.filter(b => {
      const ci = new Date(b.checkIn);
      return ci > now && b.status !== 'cancelled';
    }).sort((a,b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  }, [bookings]);

  const totalBookings = bookings.length;
  const upcomingCount = upcoming.length;

  // Calculate average rating from user's bookings
  const averageRating = useMemo(() => {
    const ratedBookings = bookings.filter(b => b.rating !== null && b.rating !== undefined && b.rating > 0);
    if (ratedBookings.length === 0) return 0;
    return ratedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBookings.length;
  }, [bookings]);

  const totalReviews = useMemo(() => {
    return bookings.filter(b => b.rating !== null && b.rating !== undefined && b.rating > 0).length;
  }, [bookings]);

  return (
    <DashboardLayout userRole="customer">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="p-4 md:p-6 space-y-6 md:space-y-8 relative z-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center animate-fade-in relative overflow-hidden">
            {/* Floating gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />

            <div className="max-w-4xl mx-auto relative z-10">
              {/* Globe with Travel Routes */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-6 md:mb-8 animate-bounce-in relative group">
                <img
                  src={globeImage}
                  alt="Global travel routes and connections"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all" />
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
                Welcome to Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Travel Hub
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-6 md:mb-8 leading-relaxed px-4 md:px-0">
                Find, book, and enjoy your next trip with AI-powered recommendations and personalized experiences
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mb-6 md:mb-8">
                <Search className="absolute left-4 top-4 h-5 w-5 md:h-6 md:w-6 text-slate-400" />
                <Input
                  placeholder="Search hotels, destinations, or dates..."
                  className="pl-12 pr-6 py-3 md:py-4 text-base md:text-lg bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl shadow-lg focus:shadow-xl transition-all"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0">
                {[
                  { icon: Sparkles, text: "AI Recommendations", color: "from-blue-600 to-purple-600" },
                  { icon: Zap, text: "Instant Booking", color: "from-purple-600 to-pink-600" },
                  { icon: Shield, text: "Secure Payments", color: "from-emerald-600 to-teal-600" }
                ].map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl px-4 md:px-6 py-2 md:py-3 hover:bg-white hover:shadow-lg transition-all group text-sm md:text-base"
                  >
                    <action.icon className={`w-4 h-4 md:w-5 md:h-5 mr-2 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-4 md:p-6 relative z-10">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{totalBookings}</p>
                    <p className="text-xs md:text-sm text-slate-600">Total Bookings</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-4 md:p-6 relative z-10">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{upcomingCount}</p>
                    <p className="text-xs md:text-sm text-slate-600">Upcoming Trips</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-4 md:p-6 relative z-10">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">5</p>
                    <p className="text-xs md:text-sm text-slate-600">Saved Hotels</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-4 md:p-6 relative z-10">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-2xl md:text-3xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 md:w-4 md:h-4 ${
                              i < Math.floor(averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : i < averageRating
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600">{totalReviews} Reviews</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* My Bookings & Quick Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">My Recent Bookings</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/customer/bookings')}>View All</Button>
                </div>
                {loading.bookings ? (
                  <div className="text-slate-600">Loading bookings…</div>
                ) : bookings.length === 0 ? (
                  <div className="text-slate-600">No bookings yet. Start exploring amazing stays!</div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((b) => {
                      const p = typeof b.property === 'string' ? null : b.property;
                      const img = p && ((p.defaultRoomImages && p.defaultRoomImages[0]?.url) || (p.images && p.images[0]?.url));
                      return (
                        <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                          <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                            {img ? <img src={img} alt={p?.name || 'room'} className="w-full h-full object-cover" /> : null}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 flex items-center gap-2">
                              <span>{p?.name || 'Property'}</span>
                              <Badge variant="secondary" className="capitalize">{b.status}</Badge>
                            </div>
                            <div className="text-xs text-slate-600">
                              {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} • {p?.city}, {p?.country}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => navigate(`/dashboard/customer/property/${p?._id || ''}`)}>View</Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              
              <div className="p-6 md:p-8 relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Upcoming Bookings</h3>
                {loading.bookings ? (
                  <div className="text-slate-600">Loading…</div>
                ) : upcoming.length === 0 ? (
                  <div className="text-slate-600">No upcoming trips yet.</div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 4).map((b) => {
                      const p = typeof b.property === 'string' ? null : b.property;
                      return (
                        <div key={b._id} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-slate-900">{p?.name || 'Property'}</div>
                            <Badge variant="secondary" className="capitalize">{b.status}</Badge>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} • {p?.city}, {p?.country}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Recommended Hotels */}
          <div className="animate-scale-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                  Recommended
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Hotels
                  </span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base">Discover amazing stays curated just for you</p>
              </div>
              <Button onClick={() => navigate('/dashboard/customer/search')} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium text-sm md:text-base w-full sm:w-auto">
                View All
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {loading.recommended && (
                <Card className="p-6">Loading recommendations…</Card>
              )}
              {!loading.recommended && recommended.slice(0, 6).map((hotel) => {
                const img = (hotel.defaultRoomImages && hotel.defaultRoomImages[0]?.url) || (hotel.images && hotel.images[0]?.url) || hotelImage;
                return (
                  <Card key={hotel._id} className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative"
                    onClick={() => navigate(`/dashboard/customer/room/${hotel._id}`)}
                  >
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                    <div className="h-56 overflow-hidden relative">
                      <img src={img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <div className="p-4 md:p-6 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                        <Heart className="w-4 h-4 md:w-5 md:h-5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer group-hover:scale-110" />
                      </div>
                      <div className="flex items-center space-x-3 mb-4 text-xs md:text-sm text-slate-600">
                        <div className="flex items-center space-x-1"><MapPin className="w-3 h-3" /> <span>{hotel.city}, {hotel.country}</span></div>
                        <div className="flex items-center space-x-1"><Users className="w-3 h-3" /> <span>{hotel.rooms} rooms</span></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl md:text-2xl font-bold text-slate-900">${hotel.price}</span>
                          <span className="text-xs md:text-sm text-slate-600">/night</span>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium text-sm md:text-base">
                          Book Now
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {!loading.recommended && recommended.length === 0 && (
                <Card className="p-6">No recommendations yet. Try searching for hotels.</Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;