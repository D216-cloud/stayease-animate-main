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
  Calendar
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
import hotelImage from "@/assets/hotel-construction.jpg";

const Properties = () => {
  const navigate = useNavigate();
  const properties = [
    {
      id: 1,
      name: "Royal Inn",
      location: "Paris, France",
      type: "Hotel",
      rooms: 150,
      status: "Active",
      occupancy: 85,
      rating: 4.8,
      revenue: "$15,200",
      bookings: 45,
      image: hotelImage
    },
    {
      id: 2,
      name: "Beach Resort",
      location: "Maldives",
      type: "Resort",
      rooms: 80,
      status: "Pending",
      occupancy: 72,
      rating: 4.9,
      revenue: "$12,800",
      bookings: 32,
      image: hotelImage
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Swiss Alps",
      type: "Lodge",
      rooms: 45,
      status: "Active",
      occupancy: 68,
      rating: 4.7,
      revenue: "$8,400",
      bookings: 28,
      image: hotelImage
    },
    {
      id: 4,
      name: "City Business Hotel",
      location: "Tokyo, Japan",
      type: "Business Hotel",
      rooms: 200,
      status: "Maintenance",
      occupancy: 0,
      rating: 4.6,
      revenue: "$0",
      bookings: 0,
      image: hotelImage
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Maintenance':
        return 'bg-slate-100 text-slate-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                <Building className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Properties
              </h1>
            </div>
            <p className="text-slate-600">Manage your hotel properties and listings</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/hotel-owner/add-property')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
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
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{properties.length}</p>
                  <p className="text-sm text-slate-600">Total Properties</p>
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
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{properties.filter(p => p.status === 'Active').length}</p>
                  <p className="text-sm text-slate-600">Active</p>
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
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{properties.reduce((sum, p) => sum + p.rooms, 0)}</p>
                  <p className="text-sm text-slate-600">Total Rooms</p>
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
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">4.7</p>
                  <p className="text-sm text-slate-600">Avg. Rating</p>
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
              placeholder="Search properties..."
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
                <SelectItem value="active" className="text-slate-900 hover:bg-slate-100">Active</SelectItem>
                <SelectItem value="pending" className="text-slate-900 hover:bg-slate-100">Pending</SelectItem>
                <SelectItem value="maintenance" className="text-slate-900 hover:bg-slate-100">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-900">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-slate-900 hover:bg-slate-100">All Types</SelectItem>
                <SelectItem value="hotel" className="text-slate-900 hover:bg-slate-100">Hotel</SelectItem>
                <SelectItem value="resort" className="text-slate-900 hover:bg-slate-100">Resort</SelectItem>
                <SelectItem value="lodge" className="text-slate-900 hover:bg-slate-100">Lodge</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Properties Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <Card key={property.id} className="bg-white/95 backdrop-blur-md border-0 shadow-xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)} border-0`}>
                  {property.status}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">{property.name}</h3>
                    <div className="flex items-center space-x-1 text-slate-600 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-slate-200">
                      <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Rooms</p>
                    <p className="font-medium text-slate-900">{property.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-slate-900">{property.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Occupancy</p>
                    <p className="font-medium text-slate-900">{property.occupancy}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Revenue</p>
                    <p className="font-medium text-slate-900">{property.revenue}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm text-slate-500">{property.bookings} bookings</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">Manage</Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                      onClick={() => navigate(`/dashboard/hotel-owner/properties/${property.id}/rooms`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Properties Table (desktop) + Card list (mobile) */}
        <div className="md:block hidden">
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Detailed View</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50">
                  <TableHead className="text-slate-700 font-medium">Property</TableHead>
                  <TableHead className="text-slate-700 font-medium">Location</TableHead>
                  <TableHead className="text-slate-700 font-medium">Type</TableHead>
                  <TableHead className="text-slate-700 font-medium">Rooms</TableHead>
                  <TableHead className="text-slate-700 font-medium">Status</TableHead>
                  <TableHead className="text-slate-700 font-medium">Occupancy</TableHead>
                  <TableHead className="text-slate-700 font-medium">Rating</TableHead>
                  <TableHead className="text-slate-700 font-medium">Revenue</TableHead>
                  <TableHead className="text-slate-700 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-slate-100">
                          <img 
                            src={property.image} 
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-slate-900">{property.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{property.location}</TableCell>
                    <TableCell className="text-slate-700">{property.type}</TableCell>
                    <TableCell className="text-slate-700">{property.rooms}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(property.status)} border-0`}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${property.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600">{property.occupancy}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-slate-700">{property.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{property.revenue}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200">
                          <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            <Card key={property.id} className="bg-white/95 backdrop-blur-md border-0 shadow-lg overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{property.name}</h4>
                      <div className="text-xs text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3"/>{property.location}</div>
                    </div>
                    <Badge className={`${getStatusColor(property.status)} border-0`}>{property.status}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <div>Rooms: <span className="font-medium text-slate-900">{property.rooms}</span></div>
                    <div>Occ: <span className="font-medium text-slate-900">{property.occupancy}%</span></div>
                    <div>Rating: <span className="font-medium text-slate-900">{property.rating}</span></div>
                    <div>Revenue: <span className="font-medium text-slate-900">{property.revenue}</span></div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Manage</Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={() => navigate(`/dashboard/hotel-owner/properties/${property.id}/rooms`)}
                    >
                      View
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