import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { PropertiesAPI, type Property } from '@/lib/api';

export default function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await PropertiesAPI.getPublic(id);
        if (!ignore && res.success && res.data) setProperty(res.data);
      } finally { if (!ignore) setLoading(false); }
    };
    run();
    return () => { ignore = true; };
  }, [id]);

  return (
    <DashboardLayout userRole="customer">
      <div className="relative p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Hotel Details</h1>
        </div>

        {loading && (
          <div className="text-slate-600">Loading...</div>
        )}

        {!loading && property && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                  {(property.images || []).slice(0, 9).map((img, idx) => (
                    <img key={idx} src={img.url} alt={property.name} className="w-full h-40 object-cover rounded" />
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-slate-900">{property.name}</h2>
                </div>
                <div className="flex items-center gap-4 text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.city}, {property.country}</span>
                </div>
                <p className="text-slate-700 mb-4">{property.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-2">
                  {(property.amenities || []).map((a, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700">{a}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <div className="text-sm text-slate-500 mb-1">From</div>
                <div className="text-3xl font-bold text-slate-900">${property.price}<span className="text-sm text-slate-500 font-normal">/night</span></div>
              </Card>

              <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Default Room</h3>
                <div className="space-y-1 text-slate-700">
                  <div><span className="text-slate-500">Name:</span> {property.defaultRoom?.name || '—'}</div>
                  <div><span className="text-slate-500">Type:</span> {property.defaultRoom?.roomType || '—'}</div>
                  <div><span className="text-slate-500">Capacity:</span> {property.defaultRoom?.capacity ?? '—'}</div>
                  <div><span className="text-slate-500">Bed:</span> {property.defaultRoom?.bedType || '—'}</div>
                  <div><span className="text-slate-500">Size:</span> {property.defaultRoom?.size ? `${property.defaultRoom?.size} sqm` : '—'}</div>
                </div>
                <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600">Reserve</Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}