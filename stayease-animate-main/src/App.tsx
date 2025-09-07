import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import HotelOwnerDashboard from "./pages/HotelOwnerDashboard";

// Customer Pages
import SearchHotels from "./pages/customer/SearchHotels";
import MyBookings from "./pages/customer/MyBookings";
import Wishlist from "./pages/customer/Wishlist";
import Messages from "./pages/customer/Messages";
import CustomerRoomDetails from "./pages/customer/CustomerRoomDetails";
import CustomerPropertyDetails from "./pages/customer/PropertyDetails";
import CustomerRoom from "./pages/customer/Room";

// Owner Pages
import Properties from "./pages/owner/Properties";
import OwnerBookings from "./pages/owner/OwnerBookings";
import Analytics from "./pages/owner/Analytics";
import Guests from "./pages/owner/Guests";
import AddProperty from "./pages/owner/AddProperty";
import RoomDetails from "./pages/owner/RoomDetails";
import PropertyDetails from "./pages/owner/PropertyDetails";
import EditProperty from "./pages/owner/EditProperty";

// General Pages
import About from "./pages/About";
import Contact from "./pages/Contact";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple dashboard redirect component
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  const dashboardPath = user?.role === 'hotel_owner' 
    ? '/dashboard/hotel-owner' 
    : '/dashboard/customer';
  
  return <Navigate to={dashboardPath} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Dashboard Redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Protected Customer Routes */}
            <Route path="/dashboard/customer" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/search" element={
              <ProtectedRoute requiredRole="customer">
                <SearchHotels />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/property/:propertyId" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerPropertyDetails />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/room/:propertyId" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerRoom />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/search/:hotelId/:roomId" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerRoomDetails />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/bookings" element={
              <ProtectedRoute requiredRole="customer">
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/wishlist" element={
              <ProtectedRoute requiredRole="customer">
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer/messages" element={
              <ProtectedRoute requiredRole="customer">
                <Messages />
              </ProtectedRoute>
            } />
            
            {/* Protected Hotel Owner Routes */}
            <Route path="/dashboard/hotel-owner" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <HotelOwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/properties" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <Properties />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/properties/:propertyId/rooms" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <RoomDetails />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/properties/:propertyId" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <PropertyDetails />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/properties/:propertyId/edit" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <EditProperty />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/add-property" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <AddProperty />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/bookings" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <OwnerBookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/analytics" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotel-owner/guests" element={
              <ProtectedRoute requiredRole="hotel_owner">
                <Guests />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
