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

const EditProperty = () => {
  const { propertyId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);

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
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = (public_id: string) => {
    if (!property) return;
    const remaining = (property.images || []).filter(i => i.public_id !== public_id);
    setProperty({ ...property, images: remaining });
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !property) return;
    setSaving(true);
    try {
      const newImagesData = await Promise.all(newImages.map(fileToDataUrl));
      const removeIds: string[] = []; // we already removed locally; backend removal optional if sent here
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
        price: property.price,
        amenities: property.amenities,
        newImages: newImagesData,
        removeImagePublicIds: removeIds,
        isActive: property.isActive,
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
      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={onSave} className="space-y-6">
          <Card className="p-4 space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={property.name} onChange={e => updateField('name', e.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={property.type} onValueChange={v => updateField('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="lodge">Lodge</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={property.description || ''} onChange={e => updateField('description', e.target.value)} />
            </div>
          </Card>

          <Card className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <Label>Address</Label>
              <Input value={property.address} onChange={e => updateField('address', e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={property.city} onChange={e => updateField('city', e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={property.country} onChange={e => updateField('country', e.target.value)} />
            </div>
            <div>
              <Label>ZIP</Label>
              <Input value={property.zipCode || ''} onChange={e => updateField('zipCode', e.target.value)} />
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
            <div className="grid grid-cols-4 gap-2">
              {(property.images || []).map(img => (
                <div key={img.public_id} className="relative">
                  <img src={img.url} className="w-full h-24 object-cover rounded" />
                  {/* For simplicity we won’t send remove list; could be added */}
                  {/* <Button size="sm" variant="destructive" onClick={() => removeExistingImage(img.public_id)}>Remove</Button> */}
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" onChange={onUpload} />
            {newImages.length > 0 && <div className="text-sm text-slate-600">New images to upload: {newImages.length}</div>}
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
