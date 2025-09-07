import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Users,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  ArrowLeft,
  Heart,
  Share,
  Phone,
  Mail,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import hotelImage from "@/assets/hotel-construction.jpg";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample room data - in a real app this would come from an API
  const roomData = {
    id: "R001",
    name: "Deluxe Ocean View Suite",
    propertyName: "Royal Palace Hotel",
    propertyLocation: "Paris, France",
    type: "Suite",
    capacity: 4,
    beds: "1 King Bed + 1 Sofa Bed",
    bathrooms: 2,
    size: "850 sq ft",
    price: 299,
    rating: 4.8,
    reviews: 127,
    status: "Available",
    description: "Experience luxury living in our Deluxe Ocean View Suite, featuring stunning panoramic ocean views, premium amenities, and spacious living areas perfect for families or business travelers.",
    amenities: [
      "Free WiFi", "Ocean View", "Balcony", "Mini Bar", "Room Service",
      "Air Conditioning", "Flat Screen TV", "Safe Box", "Hair Dryer", "Coffee Maker",
      "Iron & Ironing Board", "Bathrobes", "Slippers", "24/7 Concierge"
    ],
    features: [
      "Panoramic Ocean Views",
      "Private Balcony",
      "Marble Bathroom",
      "Walk-in Closet",
      "Soundproof Windows",
      "Climate Control",
      "Electronic Safe",
      "USB Charging Ports"
    ],
    policies: [
      "Check-in: 3:00 PM",
      "Check-out: 11:00 AM",
      "No smoking",
      "Pets allowed with fee",
      "Free cancellation up to 24 hours",
      "Payment upon check-in"
    ]
  };

  // Sample images - 10 different room images
  const roomImages = [
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage,
    hotelImage
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/hotel-owner/properties')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Properties</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={roomImages[currentImageIndex]}
                    alt={`${roomData.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {roomImages.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-4 border-t">
                <div className="flex space-x-2 overflow-x-auto">
                  {roomImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Room Details */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{roomData.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>{roomData.propertyName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{roomData.propertyLocation}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">{roomData.status}</Badge>
              </div>

              <p className="text-slate-700 mb-6">{roomData.description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Users className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Capacity</p>
                  <p className="font-semibold text-slate-900">{roomData.capacity} guests</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Bed className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Bed</p>
                  <p className="font-semibold text-slate-900">{roomData.beds}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Bath className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Bathrooms</p>
                  <p className="font-semibold text-slate-900">{roomData.bathrooms}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Square className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-sm text-slate-600">Size</p>
                  <p className="font-semibold text-slate-900">{roomData.size}</p>
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">{roomData.rating}</span>
                  <span className="text-slate-600">({roomData.reviews} reviews)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Pricing and Actions */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">${roomData.price}</div>
                <div className="text-slate-600">per night</div>
              </div>

              <div className="space-y-3 mb-6">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Edit Room Details
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Manage Availability
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
              </div>
            </Card>

            {/* Property Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Property Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Property</span>
                  <span className="font-medium text-slate-900">{roomData.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="font-medium text-slate-900">{roomData.propertyLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Room Type</span>
                  <span className="font-medium text-slate-900">{roomData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Room ID</span>
                  <span className="font-medium text-slate-900">{roomData.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Amenities */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Amenities & Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {roomData.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-slate-700">{amenity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Room Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Policies */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Policies & Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomData.policies.map((policy, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-700">{policy}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                date: "2024-01-15",
                comment: "Absolutely stunning room with incredible ocean views. The service was exceptional and the amenities were top-notch."
              },
              {
                name: "Mike Chen",
                rating: 4,
                date: "2024-01-10",
                comment: "Great room, very comfortable and clean. The balcony view was spectacular. Only minor issue was the WiFi connection."
              }
            ].map((review, index) => (
              <div key={index} className="border-b border-slate-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-900">{review.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-1">{review.comment}</p>
                <p className="text-slate-500 text-xs">{review.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RoomDetails;
