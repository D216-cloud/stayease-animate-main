import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Star, Check, Image as ImageIcon, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PropertiesAPI, type Property } from "@/lib/api";
import { Wishlist } from "@/lib/wishlist";

const CustomerRoom = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { toast } = useToast();
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Booking dialog state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

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
          else setError(res.message || "Property not found");
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

  useEffect(() => {
    if (data?._id) {
      setIsSaved(Wishlist.isSaved(data._id));
    }
  }, [data?._id]);

  const images = (data?.defaultRoomImages && data.defaultRoomImages.length > 0)
    ? data.defaultRoomImages.map(i => i.url)
    : (data?.images || []).map(i => i.url);

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const calculateDays = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 1;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateDays();
  const roomTotal = (data?.price ?? 0) * nights;
  const taxes = 25 * nights;
  const total = roomTotal + taxes;

  return (
    <DashboardLayout userRole="customer">
      <div className="relative p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {data && (
            <div className="text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {data.city}, {data.country}
            </div>
          )}
          {data && (
            <button
              className="ml-auto p-2 rounded-md hover:bg-slate-100"
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => {
                const nowSaved = Wishlist.toggle(data);
                setIsSaved(nowSaved);
              }}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
            </button>
          )}
        </div>

        {loading && <Card className="p-6">Loading…</Card>}
        {error && <Card className="p-6 text-red-600">{error}</Card>}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="overflow-hidden bg-white/95 backdrop-blur-md border-0 shadow-xl">
                {images.length > 0 ? (
                  <div className="relative">
                    <img
                      src={images[currentImageIndex]}
                      alt={`${data.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6 mr-2" /> No images</div>
                )}
                {images.length > 0 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                            index === currentImageIndex ? 'border-blue-500 scale-105' : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{data.name}</h1>
                <p className="text-slate-600 mt-2">{data.description || "No description provided."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(data.amenities || []).map((a, i) => (
                    <Badge key={i} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </Card>

              {data.defaultRoom && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Room Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700">
                    {data.defaultRoom.name && <div><span className="text-slate-500">Name: </span>{data.defaultRoom.name}</div>}
                    {data.defaultRoom.roomType && <div><span className="text-slate-500">Type: </span>{data.defaultRoom.roomType}</div>}
                    {typeof data.defaultRoom.capacity === 'number' && <div><span className="text-slate-500">Capacity: </span>{data.defaultRoom.capacity}</div>}
                    {data.defaultRoom.bedType && <div><span className="text-slate-500">Bed: </span>{data.defaultRoom.bedType}</div>}
                    {typeof data.defaultRoom.size === 'number' && <div><span className="text-slate-500">Size: </span>{data.defaultRoom.size} m²</div>}
                    <div><span className="text-slate-500">Smoking: </span>{data.defaultRoom.smokingAllowed ? 'Allowed' : 'No'}</div>
                    <div><span className="text-slate-500">Breakfast: </span>{data.defaultRoom.breakfastIncluded ? 'Included' : 'Not included'}</div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="text-3xl font-bold">${data.price}<span className="text-sm text-slate-500 font-normal">/night</span></div>
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="text-sm text-slate-600">Stay: {nights} night{nights !== 1 ? 's' : ''}</div>
                )}
                <Separator className="my-4" />

                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 mb-4">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Booking</DialogTitle>
                    </DialogHeader>

                    {!paymentSuccess ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm">Check-in Date</label>
                            <Input type="date" value={bookingData.checkIn} onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm">Check-out Date</label>
                            <Input type="date" value={bookingData.checkOut} onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })} />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm">Guests</label>
                          <Select value={String(bookingData.guests)} onValueChange={(v) => setBookingData({ ...bookingData, guests: parseInt(v) })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4].map(n => (<SelectItem key={n} value={String(n)}>{n} Guest{n>1?'s':''}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div>
                          <label className="text-sm">Card Number</label>
                          <Input placeholder="1234 5678 9012 3456" value={bookingData.cardNumber} onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm">Expiry</label>
                            <Input placeholder="MM/YY" value={bookingData.expiryDate} onChange={(e) => setBookingData({ ...bookingData, expiryDate: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm">CVV</label>
                            <Input placeholder="123" value={bookingData.cvv} onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm">Card Holder</label>
                          <Input placeholder="John Doe" value={bookingData.cardHolder} onChange={(e) => setBookingData({ ...bookingData, cardHolder: e.target.value })} />
                        </div>

                        <Button onClick={() => {
                          const q = new URLSearchParams({ checkIn: bookingData.checkIn || '', checkOut: bookingData.checkOut || '', guests: String(bookingData.guests || 1) });
                          navigate(`/dashboard/customer/payment/${data._id}?${q.toString()}`);
                        }} className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                          Continue to Payment
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
                        <p className="text-slate-600">Your booking has been confirmed.</p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span>Room rate ({nights} night{nights !== 1 ? 's' : ''})</span><span>${roomTotal}</span></div>
                  <div className="flex justify-between"><span>Taxes & fees</span><span>${taxes}</span></div>
                  <Separator />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>${total}</span></div>
                </div>
              </Card>

              <Card className="p-6 text-sm text-slate-700">
                <div className="font-semibold">Address</div>
                <div className="text-slate-600 mt-1">{data.address}</div>
                {data.website && (<div className="mt-2"><span className="text-slate-500">Website: </span><a href={data.website} target="_blank" className="text-blue-600 underline">{data.website}</a></div>)}
                <div className="mt-2"><span className="text-slate-500">Contact: </span>{data.phone} • {data.email}</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerRoom;
