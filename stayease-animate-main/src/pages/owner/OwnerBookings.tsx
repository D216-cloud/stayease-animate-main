import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookingsAPI, type Booking, type Property } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const OwnerBookings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiBookings, setApiBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await BookingsAPI.listOwnerMine();
        if (!res.success) throw new Error(res.message || 'Failed to load bookings');
        if (mounted) setApiBookings(res.data || []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load bookings';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-slate-100 text-slate-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  type OwnerUIBooking = {
    id: string;
    guest: string;
    email?: string;
    property: string;
    room?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    amount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  };

  const mapToUi = useCallback((b: Booking): OwnerUIBooking | null => {
    if (!b.property || typeof b.property === 'string') return null;
    const prop = b.property as Property;
    const guestName = (typeof b.customer !== 'string' && b.customer)
      ? `${b.customer.first_name} ${b.customer.last_name}`
      : 'Guest';
    return {
      id: b._id,
      guest: guestName,
      email: typeof b.customer !== 'string' && b.customer ? b.customer.email : undefined,
      property: prop.name,
      room: prop.defaultRoom?.name,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests: b.guests,
      nights: b.nights,
      amount: b.totalAmount,
      status: b.status,
    };
  }, []);

  const bookings: OwnerUIBooking[] = useMemo(() => apiBookings.map(mapToUi).filter(Boolean) as OwnerUIBooking[], [apiBookings, mapToUi]);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const allBookings = bookings;

  const handleUpdateStatus = async (id: string, status: OwnerUIBooking['status']) => {
    try {
      const res = await BookingsAPI.updateStatus(id, status);
      if (!res.success) throw new Error(res.message || 'Update failed');
      const list = await BookingsAPI.listOwnerMine();
      if (list.success) setApiBookings(list.data || []);
      toast({ title: 'Booking updated', description: `Status changed to ${status}` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
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

      <div className="relative p-6 space-y-6">
        {/* Enhanced Hero Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Bookings
              </h1>
            </div>
            <p className="text-slate-600">Manage guest reservations and check-ins</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{allBookings.length}</p>
                  <p className="text-sm text-slate-600">Total Bookings</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{activeBookings.length}</p>
                  <p className="text-sm text-slate-600">Active</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{upcomingBookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-sm text-slate-600">Pending</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">${allBookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search bookings by guest name, booking ID, or property..."
              className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-slate-900 hover:bg-slate-100">All Status</SelectItem>
                <SelectItem value="confirmed" className="text-slate-900 hover:bg-slate-100">Confirmed</SelectItem>
                <SelectItem value="pending" className="text-slate-900 hover:bg-slate-100">Pending</SelectItem>
                <SelectItem value="completed" className="text-slate-900 hover:bg-slate-100">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-slate-900 hover:bg-slate-100">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-slate-900 hover:bg-slate-100">All Properties</SelectItem>
                <SelectItem value="royal-inn" className="text-slate-900 hover:bg-slate-100">Royal Inn</SelectItem>
                <SelectItem value="beach-resort" className="text-slate-900 hover:bg-slate-100">Beach Resort</SelectItem>
                <SelectItem value="mountain-lodge" className="text-slate-900 hover:bg-slate-100">Mountain Lodge</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 border border-slate-200">
            <TabsTrigger value="all" className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              All ({allBookings.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Completed ({allBookings.filter(b => b.status === 'completed').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {/* Desktop table */}
            <div className="md:block hidden">
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-slate-50">
                      <TableHead className="text-slate-700 font-medium">Guest</TableHead>
                      <TableHead className="text-slate-700 font-medium">Property & Room</TableHead>
                      <TableHead className="text-slate-700 font-medium">Dates</TableHead>
                      <TableHead className="text-slate-700 font-medium">Guests</TableHead>
                      <TableHead className="text-slate-700 font-medium">Amount</TableHead>
                      <TableHead className="text-slate-700 font-medium">Status</TableHead>
                      <TableHead className="text-slate-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow><TableCell colSpan={7} className="text-center text-slate-500">Loading…</TableCell></TableRow>
                    )}
                    {error && !loading && (
                      <TableRow><TableCell colSpan={7} className="text-center text-red-600">{error}</TableCell></TableRow>
                    )}
                    {!loading && !error && allBookings.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-slate-500">No bookings yet.</TableCell></TableRow>
                    )}
                    {allBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 ring-2 ring-slate-100">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {booking.guest.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{booking.guest}</p>
                              <p className="text-sm text-slate-500">{booking.email || ''}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{booking.property}</p>
                            <p className="text-sm text-slate-500">{booking.room}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-500">{booking.nights} nights</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900">{booking.guests}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900">${booking.amount}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(booking.status)} border-0 flex items-center space-x-1 w-fit`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
              {booking.status === 'pending' && (
                              <>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>
                                  Confirm
                                </Button>
                <Button size="sm" variant="destructive" className="border-red-200 hover:bg-red-50 text-red-700" onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>
                                  Decline
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Mobile condensed list */}
            <div className="md:hidden space-y-4">
              {bookings.map(booking => (
                <Card key={booking.id} className="bg-white/95 backdrop-blur-md border-0 shadow-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-slate-100">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {booking.guest.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">{booking.guest}</h4>
                          <p className="text-sm text-slate-500">{booking.id} · {booking.property}</p>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0`}>{booking.status.charAt(0).toUpperCase()+booking.status.slice(1)}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-slate-600 grid grid-cols-2 gap-2">
                        <div>Dates: <span className="font-medium text-slate-900">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span></div>
                        <div>Guests: <span className="font-medium text-slate-900">{booking.guests}</span></div>
                        <div>Nights: <span className="font-medium text-slate-900">{booking.nights}</span></div>
                        <div>Amount: <span className="font-medium text-slate-900">${booking.amount}</span></div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">Call</Button>
                        <Button size="sm" variant="outline" className="flex-1">Email</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-12 h-12 ring-2 ring-slate-100">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                            {booking.guest.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{booking.guest}</h3>
                          <p className="text-sm text-slate-500">{booking.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Property</p>
                          <p className="font-medium text-slate-900">{booking.property}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Room</p>
                          <p className="font-medium text-slate-900">{booking.room}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-500">Check-in</p>
                          <p className="font-medium text-slate-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Check-out</p>
                          <p className="font-medium text-slate-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Duration</p>
                          <p className="font-medium text-slate-900">{booking.nights} nights</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-sm text-slate-500">Total Amount</p>
                        <p className="text-2xl font-bold text-slate-900">${booking.amount}</p>
                        <p className="text-sm text-slate-500">{booking.guests} guests</p>
                      </div>
                      
                      <div className="space-y-2">
                        {booking.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm
                            </Button>
                            <Button variant="destructive" className="border-red-200 hover:bg-red-50 text-red-700 flex-1">
                              <XCircle className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button className="w-full border-slate-200 text-slate-700 hover:bg-slate-50" variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Guest
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            {/* Similar structure for active bookings */}
            <p className="text-slate-500">Active bookings will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {/* Similar structure for completed bookings */}
            <p className="text-slate-500">Completed bookings will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OwnerBookings;