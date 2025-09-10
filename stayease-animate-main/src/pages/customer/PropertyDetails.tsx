import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Image as ImageIcon, Star } from "lucide-react";
import { PropertiesAPI, type Property } from "@/lib/api";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!propertyId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await PropertiesAPI.getPublic(propertyId);
        if (!ignore) {
          if (res.success && res.data) setData(res.data);
          else setError(res.message || "Failed to load property");
        }
      } catch (e) {
        if (!ignore) setError("Failed to load property");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [propertyId]);

  return (
    <DashboardLayout userRole="customer">
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {data && (
            <div className="text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {data.city}, {data.country}
            </div>
          )}
        </div>

        {loading && (
          <Card className="p-6">Loading…</Card>
        )}
        {error && (
          <Card className="p-6 text-red-600">{error}</Card>
        )}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {data.images?.length ? (
                    data.images.map((img, i) => (
                      <img key={i} src={img.url} alt={`${data.name} ${i + 1}`} className="w-full h-40 md:h-52 object-cover" />
                    ))
                  ) : (
                    <div className="h-52 flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6 mr-2" /> No images</div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{data.name}</h1>
                    {data.averageRating && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(data.averageRating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : i < (data.averageRating || 0)
                                  ? 'fill-amber-400/50 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-slate-900 text-lg">{data.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-slate-600">({data.totalReviews} reviews)</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-900">${data.price}</div>
                    <div className="text-sm text-slate-500">per night</div>
                  </div>
                </div>
                <p className="text-slate-600 mt-2">{data.description || "No description provided."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(data.amenities || []).map((a, i) => (
                    <Badge key={i} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </Card>

              {data.defaultRoom && (
                <Card className="p-6 relative">
                  {data.defaultRoom.isVIP && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">
                      VIP Room
                    </Badge>
                  )}
                  <h2 className="text-xl font-semibold mb-2">Default Room</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700">
                    {data.defaultRoom.name && <div><span className="text-slate-500">Name: </span>{data.defaultRoom.name}</div>}
                    {data.defaultRoom.roomType && <div><span className="text-slate-500">Type: </span>{data.defaultRoom.roomType}</div>}
                    {data.defaultRoom.bedType && <div><span className="text-slate-500">Bed: </span>{data.defaultRoom.bedType}</div>}
                    {typeof data.defaultRoom.capacity === 'number' && <div><span className="text-slate-500">Capacity: </span>{data.defaultRoom.capacity}</div>}
                    {typeof data.defaultRoom.size === 'number' && <div><span className="text-slate-500">Size: </span>{data.defaultRoom.size} m²</div>}
                    <div><span className="text-slate-500">Smoking: </span>{data.defaultRoom.smokingAllowed ? 'Allowed' : 'No'}</div>
                    <div><span className="text-slate-500">Breakfast: </span>{data.defaultRoom.breakfastIncluded ? 'Included' : 'Not included'}</div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <Separator className="my-4" />
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Book Now</Button>
              </Card>

              <Card className="p-6 text-sm text-slate-700">
                <div className="font-semibold">Address</div>
                <div className="text-slate-600 mt-1">{data.address}</div>
                {data.website && (
                  <div className="mt-2"><span className="text-slate-500">Website: </span><a href={data.website} target="_blank" className="text-blue-600 underline">{data.website}</a></div>
                )}
                <div className="mt-2"><span className="text-slate-500">Contact: </span>{data.phone} • {data.email}</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;
