import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ArrowLeft,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PropertiesAPI, fileToDataUrl } from "@/lib/api";

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    rooms: "",
    price: "",
    amenities: [] as string[],
  images: [] as File[],
  defaultRoomImages: [] as File[],
    defaultRoom: {
      name: '',
      roomType: '',
      capacity: 1,
      maxGuests: 2,
      bedType: '',
      size: 0,
      smokingAllowed: false,
  breakfastIncluded: false,
  isVIP: false,
  vipFeatures: [] as string[],
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenities = [
    "WiFi", "Pool", "Gym", "Restaurant", "Bar", "Spa", "Parking",
    "Room Service", "Concierge", "Laundry", "Business Center", "Pet Friendly"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleDefaultRoomChange = (field: keyof typeof formData.defaultRoom, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      defaultRoom: {
        ...prev.defaultRoom,
        [field]: value,
      },
    }));
  };

  const handleVipFeatureToggle = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      defaultRoom: {
        ...prev.defaultRoom,
        vipFeatures: checked
          ? [ ...(prev.defaultRoom.vipFeatures || []), feature ]
          : (prev.defaultRoom.vipFeatures || []).filter(f => f !== feature)
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => {
      const next = [...prev.images, ...files].slice(0, 10);
      return { ...prev, images: next };
    });
  };

  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => {
      const next = [...prev.defaultRoomImages, ...files].slice(0, 10);
      return { ...prev, defaultRoomImages: next };
    });
  };

  const removeSelectedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeSelectedRoomImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      defaultRoomImages: prev.defaultRoomImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert images to data URLs
      const imagesData = await Promise.all(
        (formData.images || []).slice(0, 10).map(fileToDataUrl)
      );
      const defaultRoomImagesData = await Promise.all(
        (formData.defaultRoomImages || []).slice(0, 10).map(fileToDataUrl)
      );

      const payload = {
        name: formData.name,
        type: formData.type as 'hotel' | 'resort' | 'lodge' | 'apartment' | 'villa',
        description: formData.description,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        rooms: Number(formData.rooms),
        price: Number(formData.price) + (formData.defaultRoom.isVIP ? 500 : 0),
        amenities: formData.amenities,
  images: imagesData,
  defaultRoomImages: defaultRoomImagesData,
  defaultRoom: formData.defaultRoom,
      };

      const res = await PropertiesAPI.create(payload);
      if (res.success) {
        toast({
          title: "Property Added Successfully!",
          description: "Your property has been listed and is now available for bookings.",
        });
        navigate('/dashboard/hotel-owner/properties');
      } else {
        toast({
          title: "Failed to add property",
          description: res.message || 'Please check your inputs and try again.',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Network error",
        description: "Could not add property. Please try again.",
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/hotel-owner/properties')}
            className="text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
              Add New Property
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-purple-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-slate-700 font-medium">Property Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter property name"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-slate-700 font-medium">Property Type *</Label>
                <Select onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="hotel" className="text-slate-900 hover:bg-slate-100">Hotel</SelectItem>
                    <SelectItem value="resort" className="text-slate-900 hover:bg-slate-100">Resort</SelectItem>
                    <SelectItem value="lodge" className="text-slate-900 hover:bg-slate-100">Lodge</SelectItem>
                    <SelectItem value="apartment" className="text-slate-900 hover:bg-slate-100">Apartment</SelectItem>
                    <SelectItem value="villa" className="text-slate-900 hover:bg-slate-100">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property..."
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-24"
                />
              </div>
            </div>
          </Card>

          {/* Location Information */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-slate-700 font-medium">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter street address"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-slate-700 font-medium">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-slate-700 font-medium">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-slate-700 font-medium">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-purple-600" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="website" className="text-slate-700 font-medium">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </Card>

          {/* Property Details */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-600" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rooms" className="text-slate-700 font-medium">Number of Rooms *</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', e.target.value)}
                  placeholder="Enter number of rooms"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-slate-700 font-medium">Base Price per Night *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter base price"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                />
                {formData.defaultRoom.isVIP && formData.price && (
                  <p className="text-sm text-purple-600 mt-1">
                    VIP Surcharge: +$500 | Total: ${Number(formData.price) + 500}/night
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    className="border-slate-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={amenity} className="text-slate-700 text-sm cursor-pointer">{amenity}</Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Default Room (Quick Setup) */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Default Room (Quick Setup)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="dr-name" className="text-slate-700 font-medium">Room Name</Label>
                <Input id="dr-name" value={formData.defaultRoom.name}
                  onChange={(e) => handleDefaultRoomChange('name', e.target.value)}
                  placeholder="e.g., Deluxe King" className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="dr-type" className="text-slate-700 font-medium">Room Type</Label>
                <Input id="dr-type" value={formData.defaultRoom.roomType}
                  onChange={(e) => handleDefaultRoomChange('roomType', e.target.value)}
                  placeholder="e.g., Deluxe / Suite" className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="dr-capacity" className="text-slate-700 font-medium">Capacity</Label>
                <Input id="dr-capacity" type="number" min={1} value={formData.defaultRoom.capacity}
                  onChange={(e) => handleDefaultRoomChange('capacity', Number(e.target.value))}
                  className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="dr-maxguests" className="text-slate-700 font-medium">Max Guests Allowed</Label>
                <Input id="dr-maxguests" type="number" min={1} value={formData.defaultRoom.maxGuests}
                  onChange={(e) => handleDefaultRoomChange('maxGuests', Number(e.target.value))}
                  className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="dr-bed" className="text-slate-700 font-medium">Bed Type</Label>
                <Input id="dr-bed" value={formData.defaultRoom.bedType}
                  onChange={(e) => handleDefaultRoomChange('bedType', e.target.value)}
                  placeholder="e.g., King / Twin" className="bg-white border-slate-200" />
              </div>
              <div>
                <Label htmlFor="dr-size" className="text-slate-700 font-medium">Room Size (sqm)</Label>
                <Input id="dr-size" type="number" min={0} value={formData.defaultRoom.size}
                  onChange={(e) => handleDefaultRoomChange('size', Number(e.target.value))}
                  className="bg-white border-slate-200" />
              </div>
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox id="dr-smoking" checked={formData.defaultRoom.smokingAllowed}
                  onCheckedChange={(c) => handleDefaultRoomChange('smokingAllowed', !!c)} />
                <Label htmlFor="dr-smoking" className="text-slate-700">Smoking Allowed</Label>
              </div>
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox id="dr-breakfast" checked={formData.defaultRoom.breakfastIncluded}
                  onCheckedChange={(c) => handleDefaultRoomChange('breakfastIncluded', !!c)} />
                <Label htmlFor="dr-breakfast" className="text-slate-700">Breakfast Included</Label>
              </div>

              {/* VIP Toggle */}
              <div className="flex items-center space-x-2 mt-8 md:col-span-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <Checkbox id="dr-vip" checked={formData.defaultRoom.isVIP}
                  onCheckedChange={(c) => handleDefaultRoomChange('isVIP', !!c)} />
                <div>
                  <Label htmlFor="dr-vip" className="text-slate-700 font-medium">Mark as VIP Room (+$500 surcharge)</Label>
                  <p className="text-sm text-slate-600">VIP rooms include premium services and are compulsory for selected features.</p>
                </div>
              </div>
            </div>

            {/* VIP Extra Features */}
            {formData.defaultRoom.isVIP && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <Label className="text-slate-700 font-medium text-lg mb-3 block">VIP Extra Features (Compulsory)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Private Lounge Access','Complimentary Champagne','Late Checkout','Concierge Service','Premium Toiletries','Airport Pickup'].map((feat) => (
                    <div key={feat} className="flex items-center space-x-2 p-2 bg-white rounded border">
                      <Checkbox id={`vip-${feat}`} checked={(formData.defaultRoom.vipFeatures || []).includes(feat)}
                        onCheckedChange={(c) => handleVipFeatureToggle(feat, !!c)} />
                      <Label htmlFor={`vip-${feat}`} className="text-slate-700 text-sm font-medium">{feat}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-3">All VIP features are included and cannot be unselected once chosen.</p>
              </div>
            )}

            {/* Default Room Images */}
            <div className="mt-6">
              <Label className="text-slate-700 font-medium">Default Room Images (up to 10)</Label>
              <Input type="file" accept="image/*" multiple onChange={handleRoomImageUpload} className="mt-2" />
              {formData.defaultRoomImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                  {formData.defaultRoomImages.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => removeSelectedRoomImage(idx)}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Image Upload */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-purple-600" />
              Property Images
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 mb-2">Drag and drop images here, or click to select</p>
              <p className="text-slate-500 text-sm">PNG, JPG, JPEG up to 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button variant="outline" className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-50">
                  Choose Files
                </Button>
              </Label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-slate-700 text-sm mb-2">Selected Images: {formData.images.length}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.images.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group border rounded overflow-hidden">
                        <img src={url} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-1 right-1 bg-white/80 text-slate-700 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/hotel-owner/properties')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Adding Property...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Property
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;