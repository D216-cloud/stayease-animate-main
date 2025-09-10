import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertiesAPI, fileToDataUrl, type Property } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Building,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ArrowLeft,
  Save,
  Edit
} from "lucide-react";

const EditProperty = () => {
  const { propertyId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (!propertyId) return;
        const res = await PropertiesAPI.get(propertyId);
        if (!cancelled) {
          if (res.success && res.data) setProperty(res.data);
          else toast({ title: 'Failed to load property', description: res.message, variant: 'destructive' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [propertyId, toast]);

  const amenitiesList = [
    'WiFi','Pool','Gym','Restaurant','Bar','Spa','Parking','Room Service','Concierge','Laundry','Business Center','Pet Friendly'
  ];

  const updateField = (key: keyof Property, value: unknown) => {
    if (!property) return;
    setProperty({ ...property, [key]: value });
  };

  const handleAmenity = (amenity: string, checked: boolean) => {
    if (!property) return;
    const curr = property.amenities || [];
    updateField('amenities', checked ? [...curr, amenity] : curr.filter(a => a !== amenity));
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => {
      const remainingSlots = Math.max(0, 10 - ((property?.images?.length || 0) - removeImageIds.length) - prev.length);
      return [...prev, ...files].slice(0, remainingSlots);
    });
  };

  const removeExistingImage = (public_id: string) => {
    if (!property) return;
    const remaining = (property.images || []).filter(i => i.public_id !== public_id);
    setProperty({ ...property, images: remaining });
    setRemoveImageIds(prev => [...prev, public_id]);
  }

  const handleVipFeatureToggle = (feature: string, checked: boolean) => {
    if (!property) return;
    const currentFeatures = property.defaultRoom?.vipFeatures || [];
    updateField('defaultRoom', {
      ...property.defaultRoom,
      vipFeatures: checked
        ? [...currentFeatures, feature]
        : currentFeatures.filter(f => f !== feature)
    });
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !property) return;
    setSaving(true);
    try {
      const newImagesData = await Promise.all(newImages.map(fileToDataUrl));
  const removeIds: string[] = removeImageIds;
      const res = await PropertiesAPI.update(propertyId, {
        name: property.name,
        type: property.type,
        description: property.description,
        address: property.address,
        city: property.city,
        country: property.country,
        zipCode: property.zipCode,
        phone: property.phone,
        email: property.email,
        website: property.website,
        rooms: property.rooms,
        price: property.price + (property.defaultRoom?.isVIP ? 500 : 0),
        amenities: property.amenities,
        newImages: newImagesData,
        removeImagePublicIds: removeIds,
        isActive: property.isActive,
  defaultRoom: property.defaultRoom,
      });
      if (res.success) {
        toast({ title: 'Property updated' });
        navigate(`/dashboard/hotel-owner/properties/${propertyId}`);
      } else {
        toast({ title: 'Update failed', description: res.message, variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout userRole="hotel-owner"><div className="p-6">Loading...</div></DashboardLayout>
  );

  if (!property) return (
    <DashboardLayout userRole="hotel-owner"><div className="p-6">Not found</div></DashboardLayout>
  );

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-float"></div>
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
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Property
            </h1>
          </div>
        </div>

        <form onSubmit={onSave} className="space-y-8">
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-slate-700 font-medium">Property Name *</Label>
                <Input
                  id="name"
                  value={property.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-slate-700 font-medium">Property Type *</Label>
                <Select value={property.type} onValueChange={v => updateField('type', v)}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                    <SelectValue />
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
                  value={property.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 min-h-24"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-slate-700 font-medium">Street Address *</Label>
                <Input
                  id="address"
                  value={property.address}
                  onChange={e => updateField('address', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-slate-700 font-medium">City *</Label>
                <Input
                  id="city"
                  value={property.city}
                  onChange={e => updateField('city', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-slate-700 font-medium">Country *</Label>
                <Input
                  id="country"
                  value={property.country}
                  onChange={e => updateField('country', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-slate-700 font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={property.zipCode || ''}
                  onChange={e => updateField('zipCode', e.target.value)}
                  className="bg-white border-slate-200 text-slate-900"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input value={property.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={property.email} onChange={e => updateField('email', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Website</Label>
              <Input value={property.website || ''} onChange={e => updateField('website', e.target.value)} />
            </div>
          </Card>

          <Card className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <Label>Rooms</Label>
              <Input type="number" value={property.rooms} onChange={e => updateField('rooms', Number(e.target.value))} />
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" value={property.price} onChange={e => updateField('price', Number(e.target.value))} />
            </div>
          </Card>

          <Card className="p-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {amenitiesList.map(a => (
                <label key={a} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={(property.amenities || []).includes(a)} onCheckedChange={(c) => handleAmenity(a, !!c)} />
                  {a}
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <Label>Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(property.images || []).map(img => (
                <div key={img.public_id} className="relative group border rounded overflow-hidden">
                  <img src={img.url} className="w-full h-24 object-cover" />
                  <button type="button" onClick={() => removeExistingImage(img.public_id)}
                    className="absolute top-1 right-1 bg-white/80 text-slate-700 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100">
                    Remove
                  </button>
                </div>
              ))}
              {newImages.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={`new-${idx}`} className="relative group border rounded overflow-hidden">
                    <img src={url} className="w-full h-24 object-cover" />
                    <button type="button" onClick={() => setNewImages(arr => arr.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-white/80 text-slate-700 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100">
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-slate-600">Images: {(property.images?.length || 0)} current, {newImages.length} new. Max 10 total.</div>
            <input type="file" multiple accept="image/*" onChange={onUpload} />
          </Card>

          <Card className="p-4 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3 font-medium">Default Room</div>
            <div>
              <Label>Name</Label>
              <Input value={property.defaultRoom?.name || ''} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, name: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Input value={property.defaultRoom?.roomType || ''} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, roomType: e.target.value })} />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" value={property.defaultRoom?.capacity || 1} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Max Guests Allowed</Label>
              <Input type="number" value={property.defaultRoom?.maxGuests || 2} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, maxGuests: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Bed Type</Label>
              <Input value={property.defaultRoom?.bedType || ''} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, bedType: e.target.value })} />
            </div>
            <div>
              <Label>Size (sqm)</Label>
              <Input type="number" value={property.defaultRoom?.size || 0} onChange={e => updateField('defaultRoom', { ...property.defaultRoom, size: Number(e.target.value) })} />
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProperty;
