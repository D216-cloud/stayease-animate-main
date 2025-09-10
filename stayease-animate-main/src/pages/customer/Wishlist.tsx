import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MapPin, Star, Calendar, Share2, Trash2, Search, Filter, ArrowRight, Phone, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import hotelImage from "@/assets/hotel-construction.jpg";
import { Wishlist as WishlistStore, type SavedProperty } from "@/lib/wishlist";
import { PropertiesAPI } from "@/lib/api";

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<SavedProperty | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<SavedProperty[]>([]);

  useEffect(() => {
    setWishlistItems(WishlistStore.list());
  }, []);

  const availableCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const removeFromWishlist = (propertyId: string) => {
    WishlistStore.remove(propertyId);
    setWishlistItems(WishlistStore.list());
    toast({ title: "Removed from wishlist" });
  };

  const shareWishlist = () => {
    // Implement share functionality
    console.log("Sharing wishlist");
  };

  const handleViewDetails = (item: SavedProperty) => {
    // Navigate to room details page
    navigate(`/dashboard/customer/room/${item._id}`);
  };

  const handleContactHotel = (item: SavedProperty) => {
    setSelectedHotel(item);
    setShowContactDialog(true);
  };

  const handleBookNow = (item: SavedProperty) => {
    // Navigate to booking flow
    navigate(`/dashboard/customer/room/${item._id}`);
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
                  Wishlist
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Your saved hotels and dream destinations, ready for booking
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                  <Search className="w-5 h-5 mr-2" />
                  Find More Hotels
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={shareWishlist} className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl px-6 py-3 hover:bg-white hover:shadow-lg transition-all">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Wishlist
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              {/* Floating gradient orbs */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{wishlistItems.length}</p>
                    <p className="text-sm text-slate-600">Saved Hotels</p>
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
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{availableCount}</p>
                    <p className="text-sm text-slate-600">Available</p>
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
                    <p className="text-3xl font-bold text-slate-900">4.8</p>
                    <p className="text-sm text-slate-600">Avg. Rating</p>
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
                      <span className="text-lg">💰</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">$187</p>
                    <p className="text-sm text-slate-600">Avg. Savings</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
              <Input
                placeholder="Search your saved hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl shadow-lg focus:shadow-xl transition-all"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48 bg-white/95 backdrop-blur-md border-slate-200/50 rounded-2xl shadow-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-added">Date Added</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Hotel Name</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl px-6 py-3 hover:bg-white hover:shadow-lg transition-all">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Wishlist Grid */}
          {wishlistItems.length > 0 ? (
            <div className="animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistItems.map((item) => (
                  <Card key={item._id} className={`group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative`}>
                    {/* Floating gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />

                    <div className="relative">
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={(item.defaultRoomImages && item.defaultRoomImages[0]?.url) || (item.images && item.images[0]?.url) || hotelImage}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>

                      {/* Wishlist Heart Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </Button>

                      {/* Availability Badge */}
                      {/* Availability badge could be wired to backend later */}

                      {/* Discount Badge */}
                      {/* Discount badge omitted for dynamic data */}
                    </div>

                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{item.city}, {item.country}</span>
                      </div>

                      {/* Ratings placeholder */}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(item.amenities || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 hover:shadow-lg transform hover:scale-105 transition-all px-3 py-1 text-xs font-medium border-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-slate-900">${item.price}</span>
                          </div>
                          <span className="text-sm text-slate-600">/night</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Added {new Date(item.savedAt).toLocaleDateString()}</span>
                        <div className="flex space-x-2">
                          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-3 py-2 hover:bg-white hover:shadow-lg transition-all"
                                onClick={() => handleContactHotel(item)}
                              >
                                <Phone className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Contact {selectedHotel?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedHotel && (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={(selectedHotel.defaultRoomImages && selectedHotel.defaultRoomImages[0]?.url) || (selectedHotel.images && selectedHotel.images[0]?.url) || hotelImage}
                                      alt={selectedHotel.name}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                      <h3 className="font-semibold text-slate-900">{selectedHotel.name}</h3>
                                      <p className="text-sm text-slate-600">{selectedHotel.city}, {selectedHotel.country}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <Phone className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm">+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Mail className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm">reservations@{selectedHotel.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <MapPin className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm">{selectedHotel.city}, {selectedHotel.country}</span>
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
                            size="sm"
                            className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-3 py-2 hover:bg-white hover:shadow-lg transition-all"
                            onClick={() => handleViewDetails(item)}
                          >
                            View
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium text-sm"
                            onClick={() => handleBookNow(item)}
                          >
                            Book Now
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                <Heart className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
              <p className="text-slate-600 mb-6">Start saving hotels you love for easy booking later</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                <Search className="w-4 h-4 mr-2" />
                Explore Hotels
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Wishlist;