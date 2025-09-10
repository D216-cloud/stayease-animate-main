import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Users,
  Star,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PropertiesAPI, type Property } from "@/lib/api";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Properties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await PropertiesAPI.listMine();
        if (!cancelled) {
          if (res.success && res.data) setProperties(res.data);
          else toast({ title: 'Failed to load properties', description: res.message, variant: 'destructive' });
        }
      } catch (e) {
        if (!cancelled) toast({ title: 'Network error', description: 'Could not fetch properties', variant: 'destructive' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    const res = await PropertiesAPI.remove(id);
    if (res.success) {
      setProperties(prev => prev.filter(p => p._id !== id));
      toast({ title: 'Property deleted' });
    } else {
      toast({ title: 'Delete failed', description: res.message, variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} this property?`)) return;
    
    try {
      const res = await PropertiesAPI.update(id, { isActive: newStatus });
      
      if (res.success) {
        setProperties(prev => 
          prev.map(p => 
            p._id === id ? { ...p, isActive: newStatus } : p
          )
        );
        toast({ 
          title: `Property ${action}d successfully`,
          description: `The property is now ${newStatus ? 'active' : 'inactive'}`
        });
      } else {
        toast({ 
          title: `Failed to ${action} property`, 
          description: res.message, 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: `Failed to ${action} property`, 
        description: 'Network error occurred', 
        variant: 'destructive' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Maintenance':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Inactive':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Enhanced Hero Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Properties
              </h1>
            </div>
            <p className="text-slate-500">Manage your hotel properties and listings</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/hotel-owner/add-property')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-5 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{properties.length}</p>
                  <p className="text-sm text-slate-500">Total Properties</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-5 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{properties.filter(p => p.isActive).length}</p>
                  <p className="text-sm text-slate-500">Active</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-5 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{properties.reduce((sum, p) => sum + (p.rooms || 0), 0)}</p>
                  <p className="text-sm text-slate-500">Total Rooms</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="group cursor-pointer bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
            
            <div className="p-5 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">4.7</p>
                  <p className="text-sm text-slate-500">Avg. Rating</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Room Card Summary */}
        {properties.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Default Room Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-slate-700">
              {properties.map(p => p.defaultRoom).filter(Boolean).slice(0,1).map((room, idx) => (
                <div key={idx} className="col-span-3 grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-slate-500">Name</div>
                    <div className="font-medium">{room?.name || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Type</div>
                    <div className="font-medium">{room?.roomType || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Capacity</div>
                    <div className="font-medium">{room?.capacity ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Bed</div>
                    <div className="font-medium">{room?.bedType || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Size</div>
                    <div className="font-medium">{room?.size ? `${room.size} sqm` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Extras</div>
                    <div className="font-medium">{[room?.smokingAllowed ? 'Smoking' : null, room?.breakfastIncluded ? 'Breakfast' : null].filter(Boolean).join(' • ') || '—'}</div>
                  </div>
                </div>
              ))}
              {properties.every(p => !p.defaultRoom) && (
                <div className="text-slate-500">No room info yet. Add default room details when creating a property.</div>
              )}
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search properties..."
              className="pl-10 bg-white/80 backdrop-blur-md border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-400"
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-md border-slate-200 text-slate-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-slate-800 hover:bg-slate-100">All Status</SelectItem>
                <SelectItem value="active" className="text-slate-800 hover:bg-slate-100">Active</SelectItem>
                <SelectItem value="pending" className="text-slate-800 hover:bg-slate-100">Pending</SelectItem>
                <SelectItem value="maintenance" className="text-slate-800 hover:bg-slate-100">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-md border-slate-200 text-slate-800">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-slate-800 hover:bg-slate-100">All Types</SelectItem>
                <SelectItem value="hotel" className="text-slate-800 hover:bg-slate-100">Hotel</SelectItem>
                <SelectItem value="resort" className="text-slate-800 hover:bg-slate-100">Resort</SelectItem>
                <SelectItem value="lodge" className="text-slate-800 hover:bg-slate-100">Lodge</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-md">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Properties Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {loading ? (
            <div className="col-span-3 flex justify-center py-10">
              <div className="animate-pulse text-slate-400">Loading properties...</div>
            </div>
          ) : properties.length === 0 ? (
            <Card className="col-span-3 p-8 text-center bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No properties yet</h3>
              <p className="text-slate-500 mb-4">Get started by adding your first property</p>
              <Button 
                onClick={() => navigate('/dashboard/hotel-owner/add-property')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </Card>
          ) : properties.map((property) => (
            <Card key={property._id} className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  {property.images?.[0]?.url ? (
                    <img 
                      src={property.images[0].url}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Building className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <Badge className={`absolute top-3 right-3 ${getStatusColor(property.isActive ? 'Active' : 'Inactive')} border backdrop-blur-md`}>
                  {property.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{property.name}</h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-sm mt-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{property.city}, {property.country}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-800 hover:bg-slate-100/50">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-slate-200/50">
                      <DropdownMenuItem className="text-slate-700 hover:bg-slate-100/50 cursor-pointer" onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-700 hover:bg-slate-100/50 cursor-pointer" onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      {property.isActive ? (
                        <DropdownMenuItem className="text-amber-600 hover:bg-amber-50/50 cursor-pointer" onClick={() => handleToggleActive(property._id, property.isActive)}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-emerald-600 hover:bg-emerald-50/50 cursor-pointer" onClick={() => handleToggleActive(property._id, property.isActive)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 cursor-pointer" onClick={() => handleDelete(property._id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Rooms</p>
                    <p className="font-medium text-slate-800">{property.rooms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-slate-800">--</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Occupancy</p>
                    <p className="font-medium text-slate-800">--</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="font-medium text-slate-800">--</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">-- bookings</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-md">
                      Manage
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
                      onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}/rooms`)}
                    >
                      View Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Properties Table (desktop) */}
        <div className="hidden md:block">
          <Card className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Detailed View</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-slate-50/50">
                  <TableHead className="text-slate-700 font-medium">Property</TableHead>
                  <TableHead className="text-slate-700 font-medium">Location</TableHead>
                  <TableHead className="text-slate-700 font-medium">Type</TableHead>
                  <TableHead className="text-slate-700 font-medium">Rooms</TableHead>
                  <TableHead className="text-slate-700 font-medium">Status</TableHead>
                  <TableHead className="text-slate-700 font-medium">Occupancy</TableHead>
                  <TableHead className="text-slate-700 font-medium">Rating</TableHead>
                  <TableHead className="text-slate-700 font-medium">Revenue</TableHead>
                  <TableHead className="text-slate-700 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                          {property.images?.[0]?.url ? (
                            <img 
                              src={property.images[0].url}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <Building className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-slate-800">{property.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{property.city}, {property.country}</TableCell>
                    <TableCell className="text-slate-700 capitalize">{property.type}</TableCell>
                    <TableCell className="text-slate-700">{property.rooms}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(property.isActive ? 'Active' : 'Inactive')} border backdrop-blur-md`}>
                        {property.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `0%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500">--%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-slate-700 text-sm">--</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 text-sm">--</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-800 hover:bg-slate-100/50">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-slate-200/50">
                            <DropdownMenuItem className="text-slate-700 hover:bg-slate-100/50 cursor-pointer" onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-700 hover:bg-slate-100/50 cursor-pointer" onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}/edit`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Property
                            </DropdownMenuItem>
                            {property.isActive ? (
                              <DropdownMenuItem className="text-amber-600 hover:bg-amber-50/50 cursor-pointer" onClick={() => handleToggleActive(property._id, property.isActive)}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-emerald-600 hover:bg-emerald-50/50 cursor-pointer" onClick={() => handleToggleActive(property._id, property.isActive)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-rose-600 hover:bg-rose-50/50 cursor-pointer" onClick={() => handleDelete(property._id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          {properties.map(property => (
            <Card key={property._id} className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
                  {property.images?.[0]?.url ? (
                    <img src={property.images[0].url} alt={property.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Building className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 truncate">{property.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0"/>
                        <span className="truncate">{property.city}, {property.country}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(property.isActive ? 'Active' : 'Inactive')} border backdrop-blur-md text-xs`}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Rooms: <span className="font-medium text-slate-800">{property.rooms}</span></div>
                    <div>Occ: <span className="font-medium text-slate-800">--%</span></div>
                    <div>Rating: <span className="font-medium text-slate-800">--</span></div>
                    <div>Revenue: <span className="font-medium text-slate-800">--</span></div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs bg-white/80 backdrop-blur-md">Manage</Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={() => navigate(`/dashboard/hotel-owner/properties/${property._id}/rooms`)}
                    >
                      View
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Properties;