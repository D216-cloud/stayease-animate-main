import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, User, Phone, Mail, Star, ArrowRight, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import hotelImage from "@/assets/hotel-construction.jpg";
import { BookingsAPI, type Booking, type Property } from "@/lib/api";

const MyBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedHotel, setSelectedHotel] = useState<null | {
    hotel: string;
    location: string;
    image: string;
  }>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiBookings, setApiBookings] = useState<Booking[]>([]);

  type UIBooking = {
    id: string;
    propertyId: string;
    hotel: string;
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    status: "pending" | "confirmed" | "cancelled" | "completed" | string;
    totalAmount: number;
    bookingRef: string;
    image: string;
  };

  // Fetch bookings from API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await BookingsAPI.listMine();
        if (!res.success) throw new Error(res.message || "Failed to load bookings");
        if (mounted) setApiBookings(res.data || []);
      } catch (e: unknown) {
        console.error("Failed to fetch bookings", e);
        const message = e instanceof Error ? e.message : "Failed to load bookings";
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const mapToUi = useCallback((b: Booking): UIBooking | null => {
    if (typeof b.property === "string" || !b.property) {
      // If backend didn't populate property, skip gracefully for now
      return null;
    }
    const prop = b.property as Property;
    const img = (prop.defaultRoomImages && prop.defaultRoomImages[0]?.url)
      || (prop.images && prop.images[0]?.url)
      || hotelImage;
    const location = [prop.city, prop.country].filter(Boolean).join(", ");
    return {
      id: b._id,
      propertyId: prop._id,
      hotel: prop.name,
      location,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests: b.guests,
      rooms: 1,
      status: b.status,
      totalAmount: b.totalAmount,
      bookingRef: b._id.slice(-8).toUpperCase(),
      image: img,
    };
  }, []);

  const bookings: UIBooking[] = useMemo(() => apiBookings.map(mapToUi).filter(Boolean) as UIBooking[], [apiBookings, mapToUi]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const stats = useMemo(() => {
    const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
    const toReview = bookings.filter(b => b.status === 'completed').length;
    const totalGuests = bookings.reduce((sum, b) => sum + (b.guests || 0), 0);
    return { total: bookings.length, upcoming, totalGuests, toReview };
  }, [bookings]);

  const handleViewDetails = (booking: UIBooking) => {
    // Navigate to room details page (property page)
    navigate(`/dashboard/customer/room/${booking.propertyId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled.",
    });
    // Update the booking status locally (in a real app, this would be handled by state management)
    console.log(`Cancelling booking ${bookingId}`);
  };

  const handleContactHotel = (booking: UIBooking) => {
    setSelectedHotel({ hotel: booking.hotel, location: booking.location, image: booking.image });
    setShowContactDialog(true);
  };

  return (
    <DashboardLayout userRole="customer">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl p-12 text-center animate-fade-in relative overflow-hidden">
            {/* Floating gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />

            <div className="max-w-4xl mx-auto relative z-10">
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bookings
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Manage your reservations and travel plans with ease
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  New Booking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
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
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-sm text-slate-600">Total Bookings</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stats.upcoming}</p>
                    <p className="text-sm text-slate-600">Upcoming</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
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
                    <p className="text-3xl font-bold text-slate-900">{stats.toReview}</p>
                    <p className="text-sm text-slate-600">To Review</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookings Tabs */}
          <div className="animate-scale-in">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/95 backdrop-blur-md border-slate-200/50 rounded-2xl shadow-lg p-1">
                <TabsTrigger value="upcoming" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6 mt-8">
                {loading && (
                  <p className="text-center text-slate-600">Loading your bookings…</p>
                )}
                {error && !loading && (
                  <p className="text-center text-red-600">{error}</p>
                )}
                {!loading && !error && upcomingBookings.length === 0 && (
                  <Card className="p-8 text-center text-slate-600">No upcoming bookings yet.</Card>
                )}
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      <div className="lg:col-span-1">
                        <div className="h-48 rounded-lg overflow-hidden mb-4 relative">
                          <img
                            src={booking.image}
                            alt={booking.hotel}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0 font-medium px-3 py-1`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{booking.hotel}</h3>
                            <div className="flex items-center space-x-2 text-slate-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{booking.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">${booking.totalAmount}</p>
                            <p className="text-sm text-slate-600">Total Amount</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-slate-600">Check-in</p>
                            <p className="font-medium text-slate-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Check-out</p>
                            <p className="font-medium text-slate-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Guests</p>
                            <p className="font-medium text-slate-900">{booking.guests} Guests</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Rooms</p>
                            <p className="font-medium text-slate-900">{booking.rooms} Room</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Booking Reference</p>
                            <p className="font-mono text-sm font-medium text-slate-900">{booking.bookingRef}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all"
                                  onClick={() => handleContactHotel(booking)}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact Hotel
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                                <DialogHeader>
                                  <DialogTitle>Contact {selectedHotel?.hotel}</DialogTitle>
                                </DialogHeader>
                                {selectedHotel && (
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={selectedHotel.image}
                                        alt={selectedHotel.hotel}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div>
                                        <h3 className="font-semibold text-slate-900">{selectedHotel.hotel}</h3>
                                        <p className="text-sm text-slate-600">{selectedHotel.location}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">+1 (555) 123-4567</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">reservations@{selectedHotel.hotel.toLowerCase().replace(/\s+/g, '')}.com</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">{selectedHotel.location}</span>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2 pt-4">
                                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Now
                                      </Button>
                                      <Button variant="outline" className="flex-1">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all"
                              onClick={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-6 mt-8">
                {!loading && !error && pastBookings.length === 0 && (
                  <Card className="p-8 text-center text-slate-600">No past bookings.</Card>
                )}
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      <div className="lg:col-span-1">
                        <div className="h-48 rounded-lg overflow-hidden mb-4 relative">
                          <img
                            src={booking.image}
                            alt={booking.hotel}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0 font-medium px-3 py-1`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{booking.hotel}</h3>
                            <div className="flex items-center space-x-2 text-slate-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{booking.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">${booking.totalAmount}</p>
                            <p className="text-sm text-slate-600">Total Paid</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-slate-600">Check-in</p>
                            <p className="font-medium text-slate-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Check-out</p>
                            <p className="font-medium text-slate-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Guests</p>
                            <p className="font-medium text-slate-900">{booking.guests} Guests</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Rooms</p>
                            <p className="font-medium text-slate-900">{booking.rooms} Room</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Booking Reference</p>
                            <p className="font-mono text-sm font-medium text-slate-900">{booking.bookingRef}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all"
                                  onClick={() => handleContactHotel(booking)}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact Hotel
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                                <DialogHeader>
                                  <DialogTitle>Contact {selectedHotel?.hotel}</DialogTitle>
                                </DialogHeader>
                                {selectedHotel && (
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={selectedHotel.image}
                                        alt={selectedHotel.hotel}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div>
                                        <h3 className="font-semibold text-slate-900">{selectedHotel.hotel}</h3>
                                        <p className="text-sm text-slate-600">{selectedHotel.location}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">+1 (555) 123-4567</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">reservations@{selectedHotel.hotel.toLowerCase().replace(/\s+/g, '')}.com</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">{selectedHotel.location}</span>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2 pt-4">
                                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Now
                                      </Button>
                                      <Button variant="outline" className="flex-1">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all"
                              onClick={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Button>
                            <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all">
                              Download Receipt
                            </Button>
                            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                              <Star className="w-4 h-4 mr-2" />
                              Write Review
                            </Button>
                            <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;