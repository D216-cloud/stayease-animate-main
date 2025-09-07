import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertiesAPI, type Property } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout userRole="hotel-owner">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Property Details</h1>
          <div className="space-x-2">
            {property && (
              <Button onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}/edit`)}>Edit</Button>
            )}
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : !property ? (
          <p>Not found</p>
        ) : (
          <Card className="p-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {property.images?.length ? property.images.map(img => (
                    <img key={img.public_id} src={img.url} className="w-full h-32 object-cover rounded" />
                  )) : <div className="text-slate-500">No images</div>}
                </div>
                <p className="text-slate-700 whitespace-pre-line">{property.description || 'No description'}</p>
              </div>
              <div className="space-y-2">
                <div><span className="font-medium">Name:</span> {property.name}</div>
                <div><span className="font-medium">Type:</span> {property.type}</div>
                <div><span className="font-medium">Location:</span> {property.address}, {property.city}, {property.country} {property.zipCode}</div>
                <div><span className="font-medium">Contact:</span> {property.phone} · {property.email}</div>
                {property.website && <div><span className="font-medium">Website:</span> {property.website}</div>}
                <div><span className="font-medium">Rooms:</span> {property.rooms}</div>
                <div><span className="font-medium">Price:</span> {property.price}</div>
                <div><span className="font-medium">Amenities:</span> {property.amenities?.join(', ') || '—'}</div>
                <div><span className="font-medium">Status:</span> {property.isActive ? 'Active' : 'Inactive'}</div>
                <div className="mt-4">
                  <div className="font-semibold">Default Room</div>
                  <div className="text-sm text-slate-700">Name: {property.defaultRoom?.name || '—'}</div>
                  <div className="text-sm text-slate-700">Type: {property.defaultRoom?.roomType || '—'}</div>
                  <div className="text-sm text-slate-700">Capacity: {property.defaultRoom?.capacity ?? '—'}</div>
                  <div className="text-sm text-slate-700">Bed: {property.defaultRoom?.bedType || '—'}</div>
                  <div className="text-sm text-slate-700">Size: {property.defaultRoom?.size ? `${property.defaultRoom?.size} sqm` : '—'}</div>
                  <div className="text-sm text-slate-700">Extras: {[
                    property.defaultRoom?.smokingAllowed ? 'Smoking' : null,
                    property.defaultRoom?.breakfastIncluded ? 'Breakfast' : null
                  ].filter(Boolean).join(' • ') || '—'}</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;
