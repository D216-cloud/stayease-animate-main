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
    images: [] as File[]
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Property Added Successfully!",
        description: "Your property has been listed and is now available for bookings.",
      });
      navigate('/dashboard/hotel-owner/properties');
      setIsSubmitting(false);
    }, 2000);
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
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="text-xs text-slate-500 truncate">
                      {file.name}
                    </div>
                  ))}
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