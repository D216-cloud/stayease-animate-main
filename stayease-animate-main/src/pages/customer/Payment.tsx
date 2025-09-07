import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check } from "lucide-react";
import { PropertiesAPI, BookingsAPI, type Property } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    guests: Number(params.get('guests') || 1),
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!propertyId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await PropertiesAPI.getPublic(propertyId);
        if (!ignore) {
          if (res.success && res.data) setData(res.data);
          else setError(res.message || 'Property not found');
        }
      } catch (e) {
        if (!ignore) setError('Failed to load property');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [propertyId]);

  const total = (data?.price ?? 0) + 25; // taxes & fees flat for demo

  const handlePay = async () => {
    if (!data || !propertyId) return;
    setProcessing(true);
    try {
      // 1) Create the booking in backend
      const res = await BookingsAPI.create({
        propertyId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests || 1,
      });
      if (!res.success) throw new Error(res.message || 'Booking failed');
      // 2) Simulate payment success UX
      setSuccess(true);
      toast({ title: 'Payment Successful!', description: 'Your booking is confirmed.' });
      setTimeout(() => navigate('/dashboard/customer/bookings'), 1200);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      toast({ title: 'Payment failed', description: message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout userRole="customer">
      <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="text-slate-600">Secure Checkout</div>
        </div>

        {loading && <Card className="p-6">Loading…</Card>}
        {error && <Card className="p-6 text-red-600">{error}</Card>}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="font-semibold text-slate-900 text-lg">{data.name}</div>
                <div className="text-slate-600">{data.city}, {data.country}</div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-600">Check-in</label>
                    <Input type="date" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Check-out</label>
                    <Input type="date" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Guests</label>
                    <Input type="number" min={1} value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value || 1) })} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="font-semibold text-slate-900 mb-4">Payment Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Card Holder</label>
                    <Input placeholder="John Doe" value={form.cardHolder} onChange={e => setForm({ ...form, cardHolder: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Expiry</label>
                    <Input placeholder="MM/YY" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">CVV</label>
                    <Input placeholder="123" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Price Card */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="text-2xl font-bold">${data.price}<span className="text-sm text-slate-500 font-normal">/night</span></div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between"><span>Room rate (1 night)</span><span>${data.price}</span></div>
                  <div className="flex justify-between"><span>Taxes & fees</span><span>$25</span></div>
                  <Separator />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>${total}</span></div>
                </div>
                <Button onClick={handlePay} disabled={processing || success} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {processing ? 'Processing…' : success ? (<span className="inline-flex items-center"><Check className="w-4 h-4 mr-2" /> Paid</span>) : 'Pay Now'}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payment;
