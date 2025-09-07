import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Heart, Filter, Calendar, Users, Wifi, Car, Coffee, ArrowRight, X } from "lucide-react";
import hotelImage from "@/assets/hotel-construction.jpg";

const SearchHotels = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const hotels = useMemo(() => [
    {
      id: 1,
      name: "Royal Palace Hotel",
      location: "Paris, France",
      rating: 4.8,
      price: 299,
      amenities: ["Free WiFi", "Parking", "Pool", "Spa"],
      image: hotelImage,
      category: "luxury"
    },
    {
      id: 2,
      name: "Maldives Beach Resort",
      location: "Maldives",
      rating: 4.9,
      price: 599,
      amenities: ["Beach", "Free WiFi", "Restaurant", "Spa"],
      image: hotelImage,
      category: "beach"
    },
    {
      id: 3,
      name: "Alpine Mountain Lodge",
      location: "Swiss Alps",
      rating: 4.7,
      price: 199,
      amenities: ["Mountain View", "Free WiFi", "Fireplace"],
      image: hotelImage,
      category: "mountain"
    },
    {
      id: 4,
      name: "Tokyo Business Hotel",
      location: "Tokyo, Japan",
      rating: 4.6,
      price: 159,
      amenities: ["Free WiFi", "Business Center", "Gym"],
      image: hotelImage,
      category: "business"
    },
    {
      id: 5,
      name: "Barcelona City Center",
      location: "Barcelona, Spain",
      rating: 4.5,
      price: 189,
      amenities: ["Free WiFi", "Restaurant", "Gym"],
      image: hotelImage,
      category: "city"
    },
    {
      id: 6,
      name: "Santorini Cliffside",
      location: "Santorini, Greece",
      rating: 4.9,
      price: 349,
      amenities: ["Ocean View", "Free WiFi", "Pool", "Spa"],
      image: hotelImage,
      category: "luxury"
    }
  ], []);

  const amenityIcons = {
    "Free WiFi": Wifi,
    "Parking": Car,
    "Restaurant": Coffee,
    "Pool": "🏊",
    "Spa": "💆",
    "Beach": "🏖️",
    "Mountain View": "🏔️",
    "Fireplace": "🔥",
    "Business Center": "💼",
    "Gym": "💪",
    "Ocean View": "🌊"
  };

  // Filter and sort hotels
  const filteredAndSortedHotels = useMemo(() => {
    const filtered = hotels.filter(hotel => {
      // Price filter
      if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (selectedRatings.length > 0 && !selectedRatings.some(rating => hotel.rating >= rating)) {
        return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0 && !selectedAmenities.every(amenity => hotel.amenities.includes(amenity))) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(query);
        const matchesLocation = hotel.location.toLowerCase().includes(query);
        const matchesAmenities = hotel.amenities.some(amenity => amenity.toLowerCase().includes(query));
        const matchesCategory = hotel.category?.toLowerCase().includes(query);

        if (!matchesName && !matchesLocation && !matchesAmenities && !matchesCategory) {
          return false;
        }
      }

      return true;
    });

    // Sort hotels
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }

    return filtered;
  }, [hotels, priceRange, selectedRatings, selectedAmenities, searchQuery, sortBy]);

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings(prev => [...prev, rating]);
    } else {
      setSelectedRatings(prev => prev.filter(r => r !== rating));
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
  };

  const clearAllFilters = () => {
    setPriceRange([100, 500]);
    setSelectedRatings([]);
    setSelectedAmenities([]);
    setSearchQuery("");
  };

  const activeFiltersCount = selectedRatings.length + selectedAmenities.length + (priceRange[0] !== 100 || priceRange[1] !== 500 ? 1 : 0);

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
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Stay
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-6 md:mb-8 leading-relaxed px-4 md:px-0">
                Discover amazing hotels and resorts with our advanced search and filtering system
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mb-6 md:mb-8">
                <Search className="absolute left-4 top-4 h-5 w-5 md:h-6 md:w-6 text-slate-400" />
                <Input
                  placeholder="Search hotels, destinations, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 md:py-4 text-base md:text-lg bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-2xl shadow-lg focus:shadow-xl transition-all"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { emoji: "🏖️", text: "Beach Resort", category: "beach", color: "from-blue-100 to-purple-100" },
                  { emoji: "🏔️", text: "Mountain View", category: "mountain", color: "from-emerald-100 to-teal-100" },
                  { emoji: "💎", text: "Luxury", category: "luxury", color: "from-purple-100 to-pink-100" },
                  { emoji: "💰", text: "Budget", category: "budget", color: "from-green-100 to-emerald-100" },
                  { emoji: "👨‍👩‍👧‍👦", text: "Family Friendly", category: "family", color: "from-orange-100 to-amber-100" }
                ].map((filter, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    onClick={() => setSearchQuery(filter.category)}
                    className={`cursor-pointer bg-gradient-to-r ${filter.color} hover:shadow-lg transform hover:scale-105 transition-all px-4 py-2 text-sm font-medium border-0`}
                  >
                    {filter.emoji} {filter.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 min-h-[600px]">
            {/* Filters Sidebar - Fixed */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                {/* Floating gradient orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />

                <div className="p-4 md:p-6 relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-slate-900 mb-2 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Star Rating */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-slate-900 mb-2 block">Star Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3].map((stars) => (
                        <div key={stars} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`stars-${stars}`}
                            checked={selectedRatings.includes(stars)}
                            onChange={(e) => handleRatingChange(stars, e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor={`stars-${stars}`} className="flex items-center space-x-1 text-sm cursor-pointer">
                            {Array.from({ length: stars }, (_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-slate-600">& up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-slate-900 mb-2 block">Amenities</label>
                    <div className="space-y-2">
                      {["Free WiFi", "Pool", "Spa", "Parking", "Restaurant", "Gym"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor={amenity} className="text-sm text-slate-600 cursor-pointer">{amenity}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all"
                      disabled={activeFiltersCount === 0}
                    >
                      Clear All ({activeFiltersCount})
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            </div>

            {/* Hotel Results - Scrollable */}
            <div className="lg:col-span-3">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Available
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Hotels
                        </span>
                      </h2>
                      <p className="text-slate-600">{filteredAndSortedHotels.length} hotels found</p>
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 bg-white/95 backdrop-blur-md border-slate-200/50 rounded-2xl shadow-lg">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-6">
                    {filteredAndSortedHotels.length > 0 ? (
                      filteredAndSortedHotels.map((hotel, index) => (
                        <Card key={hotel.id} className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                          {/* Floating gradient orbs */}
                          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />

                          <div className="flex flex-col md:flex-row">
                            {/* Hotel Image */}
                            <div className="h-48 md:h-56 md:w-64 overflow-hidden relative">
                              <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </div>

                            {/* Hotel Details */}
                            <div className="flex-1 p-4 md:p-6 relative z-10">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer group-hover:scale-110" />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-4">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                                  <span className="text-xs md:text-sm text-slate-600 font-medium">{hotel.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                                  <span className="text-xs md:text-sm text-slate-600 font-medium">{hotel.rating}</span>
                                </div>
                              </div>

                              {/* Amenities */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                                    {amenity}
                                  </Badge>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                                    +{hotel.amenities.length - 3} more
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xl md:text-2xl font-bold text-slate-900">${hotel.price}</span>
                                  <span className="text-xs md:text-sm text-slate-600">/night</span>
                                </div>
                                <Button
                                  onClick={() => navigate(`/dashboard/customer/search/${hotel.id}/1`)}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium text-sm md:text-base"
                                >
                                  Book Now
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏨</div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No hotels found</h3>
                        <p className="text-slate-600 mb-4">Try adjusting your filters or search criteria</p>
                        <Button
                          onClick={clearAllFilters}
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-6 py-2 hover:bg-white hover:shadow-lg transition-all"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchHotels;
