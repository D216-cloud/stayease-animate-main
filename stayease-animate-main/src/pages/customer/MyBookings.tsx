import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, User, Phone, Mail, Star, ArrowRight, X, Sparkles, MessageSquare, Heart, Send, CheckCircle, Info } from "lucide-react";
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
  rating?: number | null;
  review?: string;
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
    // Narrow booking shape to optionally include rating and review
    const rating = (typeof (b as unknown as { rating?: unknown }).rating === 'number') ? (b as unknown as { rating: number }).rating : undefined;
    const review = (typeof (b as unknown as { review?: unknown }).review === 'string') ? (b as unknown as { review: string }).review : undefined;
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
      rating,
      review,
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
    const ratedBookings = bookings.filter(b => b.rating !== null && b.rating !== undefined);
    const averageRating = ratedBookings.length > 0 
      ? ratedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBookings.length 
      : 0;
    return { total: bookings.length, upcoming, totalGuests, toReview, averageRating, totalReviews: ratedBookings.length };
  }, [bookings]);

  const handleViewDetails = (booking: UIBooking) => {
    // Navigate to room details page (property page)
    navigate(`/dashboard/customer/room/${booking.propertyId}`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    // Optimistic UI: flip to cancelled immediately
    const prev = apiBookings;
    setApiBookings(prev.map(b => (b._id === bookingId ? { ...b, status: 'cancelled' } : b)));
    try {
      const res = await BookingsAPI.cancelMine(bookingId);
      if (!res.success) throw new Error(res.message || 'Failed to cancel booking');
      toast({ title: 'Booking Cancelled', description: 'Your booking has been successfully cancelled.' });
    } catch (e: unknown) {
      // Revert on failure
      setApiBookings(prev);
      const message = e instanceof Error ? e.message : 'Failed to cancel booking';
      toast({ title: 'Cancel failed', description: message, variant: 'destructive' });
    }
  };

  const handleContactHotel = (booking: UIBooking) => {
    setSelectedHotel({ hotel: booking.hotel, location: booking.location, image: booking.image });
    setShowContactDialog(true);
  };

  // Review dialog state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Get current booking for review dialog
  const currentBooking = bookings.find(b => b.id === reviewBookingId);

  const openReview = (b: UIBooking) => {
    setReviewBookingId(b.id);
    setReviewRating(b.rating || 5);
    setReviewText(b.review || "");
    setReviewOpen(true);
  };

  const submitReview = async () => {
    if (!reviewBookingId) return;
    setIsSubmitting(true);
    try {
      console.log('Submitting review:', { reviewBookingId, reviewRating, reviewText });
      const res = await BookingsAPI.addReview(reviewBookingId, { rating: reviewRating, review: reviewText });
      console.log('Review submission response:', res);
      
      if (!res.success) throw new Error(res.message || 'Failed to submit review');
      
      // Show success animation
      setReviewSubmitted(true);
      
      // Wait for animation then close
      setTimeout(() => {
        setReviewOpen(false);
        setReviewSubmitted(false);
        setIsSubmitting(false);
        toast({ title: '✨ Thank you for your review!', description: 'Your feedback helps us improve.' });
      }, 2000);

      // Update bookings list
      const list = await BookingsAPI.listMine();
      if (list.success) setApiBookings(list.data || []);
    } catch (e) {
      console.error('Review submission error:', e);
      setIsSubmitting(false);
      const msg = e instanceof Error ? e.message : 'Failed to submit review';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
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
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-3xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(stats.averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : i < stats.averageRating
                                ? 'fill-amber-400/50 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{stats.totalReviews} Reviews</p>
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
                        <div 
                          className="h-48 rounded-lg overflow-hidden mb-4 relative cursor-pointer"
                          onClick={() => openReview(booking)}
                        >
                          <img
                            src={booking.image}
                            alt={booking.hotel}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          {/* Overlay rating stars on the image - empty for upcoming */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className="w-4 h-4 text-white/80" />
                            ))}
                            <span className="text-xs text-white ml-2 font-medium">Rate now</span>
                          </div>
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
                            {(booking.status === 'confirmed' || booking.status === 'pending') && (
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
                        <div 
                          className="h-48 rounded-lg overflow-hidden mb-4 relative cursor-pointer"
                          onClick={() => openReview(booking)}
                        >
                          <img
                            src={booking.image}
                            alt={booking.hotel}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-all duration-300 ${booking.rating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                          {/* Overlay rating stars on the image */}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 shadow-lg">
                            {Array.from({ length: 5 }, (_, i) => (
                              <button
                                key={i}
                                className="p-0 bg-transparent border-none"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the image click
                                  setReviewRating(i + 1);
                                  openReview(booking);
                                }}
                                aria-label={`Rate ${i + 1} star`}
                              >
                                <Star className={`w-5 h-5 ${i < (booking.rating || 0) ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'text-white/80'}`} />
                              </button>
                            ))}
                            {typeof booking.rating === 'number' && booking.rating > 0 && (
                              <span className="text-sm font-bold text-white ml-2 drop-shadow-sm">
                                {booking.rating}
                              </span>
                            )}
                          </div>
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
                            {/* Always show rating stars */}
                            <div className="mt-2 flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < (booking.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                              ))}
                              {typeof booking.rating === 'number' && booking.rating > 0 && (
                                <span className="text-xs text-slate-600 ml-1">{booking.rating.toFixed(1)}</span>
                              )}
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
                            {booking.status === 'completed' && (
                              <>
                                {booking.rating ? (
                                  <Button 
                                    variant="outline" 
                                    className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl" 
                                    onClick={() => openReview(booking)}
                                  >
                                    <Star className="w-4 h-4 mr-2 fill-amber-400" />
                                    View Review ({booking.rating}⭐)
                                  </Button>
                                ) : (
                                  <Button 
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl" 
                                    onClick={() => openReview(booking)}
                                  >
                                    <Star className="w-4 h-4 mr-2" />
                                    Rate Stay
                                  </Button>
                                )}
                              </>
                            )}
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

      {/* Enhanced Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30" aria-describedby={undefined}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg" />
          
          {/* Success Animation Overlay */}
          {reviewSubmitted && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center z-50">
              <div className="bg-white rounded-full p-8 shadow-2xl animate-bounce">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-green-500/10 rounded-lg animate-pulse" />
            </div>
          )}

          <div className={`relative transition-all duration-500 ${reviewSubmitted ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <DialogHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {currentBooking?.rating ? 'Update Your Review' : 'Rate Your Experience'}
              </DialogTitle>
              <p className="text-slate-600 mt-2">
                {currentBooking?.rating ? 'Update your feedback for this stay' : 'Your feedback helps us improve'}
              </p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Existing Rating Message */}
              {currentBooking?.rating && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold">Review Already Submitted</p>
                      <p className="text-green-600 text-sm">You rated this stay {currentBooking.rating} out of 5 stars</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Changes Message */}
              {currentBooking?.rating && reviewRating === currentBooking.rating && reviewText.trim() === (currentBooking.review || "") && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-200/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-amber-800 font-semibold">No Changes Detected</p>
                      <p className="text-amber-600 text-sm">Make changes to your rating or review to update</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200/50 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    Rate Your Stay
                  </h3>
                  <p className="text-slate-600">How would you rate your overall experience?</p>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      className="group relative p-2 transition-all duration-300 hover:scale-125 hover:rotate-12 disabled:opacity-50"
                      onClick={() => !isSubmitting && setReviewRating(i + 1)}
                      disabled={isSubmitting}
                      aria-label={`Rate ${i + 1} star`}
                    >
                      <Star 
                        className={`w-8 h-8 transition-all duration-300 ${
                          i < reviewRating 
                            ? 'fill-amber-400 text-amber-400 drop-shadow-lg scale-110' 
                            : 'text-slate-300 group-hover:text-amber-300 group-hover:scale-110'
                        }`} 
                      />
                      {i < reviewRating && (
                        <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg scale-150 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-800 font-bold text-sm shadow-md">
                    <Star className="w-4 h-4 fill-current" />
                    {reviewRating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Review Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Share your thoughts (optional)
                </h3>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border-0 bg-slate-50/50 rounded-lg p-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 resize-none disabled:opacity-50"
                  rows={3}
                  placeholder="Tell us about your experience..."
                />
              </div>

              {/* Auto-submit on rating change */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setReviewOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 border-slate-300 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </Button>
                <button 
                  onClick={submitReview}
                  disabled={isSubmitting || !reviewRating || !reviewText.trim() || (currentBooking?.rating && reviewRating === currentBooking.rating && reviewText.trim() === (currentBooking.review || ""))}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${
                    isSubmitting 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 cursor-wait' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {currentBooking?.rating ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {currentBooking?.rating ? 'Update Review' : 'Submit Review'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyBookings;