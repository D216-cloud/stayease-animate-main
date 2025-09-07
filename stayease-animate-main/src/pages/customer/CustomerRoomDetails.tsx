import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Shield,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Square,
  Calendar,
  Clock,
  CheckCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const CustomerRoomDetails = () => {
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  // Sample room data - in a real app, this would come from an API
  const roomData = {
    id: 1,
    hotelId: parseInt(hotelId || "1"),
    name: "Deluxe Ocean View Suite",
    hotelName: "Royal Palace Hotel",
    location: "Paris, France",
    type: "Suite",
    price: 299,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop"
    ],
    description: "Experience luxury and comfort in our Deluxe Ocean View Suite. This spacious room offers breathtaking views of the ocean, modern amenities, and exceptional service. Perfect for couples or small families looking for a memorable stay.",
    specifications: {
      size: "45 m²",
      bedType: "King Size Bed",
      maxOccupancy: 4,
      bathroom: "Private Bathroom with Bathtub",
      view: "Ocean View"
    },
    amenities: [
      { name: "Free WiFi", icon: Wifi, available: true },
      { name: "Parking", icon: Car, available: true },
      { name: "Breakfast", icon: Coffee, available: true },
      { name: "Fitness Center", icon: Dumbbell, available: true },
      { name: "Swimming Pool", icon: Waves, available: true },
      { name: "24/7 Security", icon: Shield, available: true }
    ],
    policies: [
      "Check-in: 3:00 PM",
      "Check-out: 11:00 AM",
      "No smoking",
      "Pets allowed with fee",
      "Free cancellation up to 24 hours",
      "Payment upon check-in"
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely stunning room with incredible ocean views. The bed was incredibly comfortable and the amenities were top-notch."
      },
      {
        id: 2,
        user: "Michael Chen",
        rating: 4,
        date: "2024-01-10",
        comment: "Great experience overall. The room was clean and well-maintained. Only minor issue was the WiFi signal in some areas."
      },
      {
        id: 3,
        user: "Emma Davis",
        rating: 5,
        date: "2024-01-08",
        comment: "Perfect for our honeymoon! The staff was attentive and the room exceeded our expectations."
      }
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomData.images.length) % roomData.images.length);
  };

  const averageRating = roomData.reviews.reduce((acc, review) => acc + review.rating, 0) / roomData.reviews.length;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
      toast({
        title: "Booking Successful!",
        description: "Your room has been booked successfully. Check your email for confirmation.",
      });
      setTimeout(() => {
        navigate('/dashboard/customer/bookings');
      }, 2000);
    }, 2000);
  };

  return (
    <DashboardLayout userRole="customer">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/customer/search')}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {roomData.name}
            </h1>
            <p className="text-slate-600">{roomData.hotelName} • {roomData.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <div className="relative">
                <img
                  src={roomData.images[currentImageIndex]}
                  alt={`${roomData.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Navigation Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {roomData.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {roomData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500 scale-105'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Room Description */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Room</h2>
              <p className="text-slate-600 leading-relaxed">{roomData.description}</p>
            </Card>

            {/* Amenities */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roomData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${amenity.available ? 'bg-green-100' : 'bg-red-100'}`}>
                      <amenity.icon className={`w-4 h-4 ${amenity.available ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <span className="text-sm text-slate-700">{amenity.name}</span>
                    {amenity.available ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Guest Reviews</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-slate-900">{averageRating.toFixed(1)}</span>
                  <span className="text-slate-600">({roomData.reviews.length} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {roomData.reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{review.user}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room Specifications */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Room Specifications</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Square className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Room Size</p>
                    <p className="font-medium text-slate-900">{roomData.specifications.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bed className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Bed Type</p>
                    <p className="font-medium text-slate-900">{roomData.specifications.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Max Occupancy</p>
                    <p className="font-medium text-slate-900">{roomData.specifications.maxOccupancy} guests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bath className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Bathroom</p>
                    <p className="font-medium text-slate-900">{roomData.specifications.bathroom}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">View</p>
                    <p className="font-medium text-slate-900">{roomData.specifications.view}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Card */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-slate-900">${roomData.price}</p>
                <p className="text-slate-600">per night</p>
              </div>

              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Complete Your Booking</DialogTitle>
                  </DialogHeader>

                  {!paymentSuccess ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="checkIn">Check-in Date</Label>
                          <Input
                            id="checkIn"
                            type="date"
                            value={bookingData.checkIn}
                            onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="checkOut">Check-out Date</Label>
                          <Input
                            id="checkOut"
                            type="date"
                            value={bookingData.checkOut}
                            onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Select value={bookingData.guests.toString()} onValueChange={(value) => setBookingData({...bookingData, guests: parseInt(value)})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4 Guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={bookingData.cardNumber}
                          onChange={(e) => setBookingData({...bookingData, cardNumber: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={bookingData.expiryDate}
                            onChange={(e) => setBookingData({...bookingData, expiryDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={bookingData.cvv}
                            onChange={(e) => setBookingData({...bookingData, cvv: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardHolder">Card Holder Name</Label>
                        <Input
                          id="cardHolder"
                          placeholder="John Doe"
                          value={bookingData.cardHolder}
                          onChange={(e) => setBookingData({...bookingData, cardHolder: e.target.value})}
                        />
                      </div>

                      <Button
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ${roomData.price}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
                      <p className="text-slate-600">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Room rate (1 night)</span>
                  <span>${roomData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span>$25</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${roomData.price + 25}</span>
                </div>
              </div>
            </Card>

            {/* Policies */}
            <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Hotel Policies</h2>
              <div className="space-y-3">
                {roomData.policies.map((policy, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{policy}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerRoomDetails;
