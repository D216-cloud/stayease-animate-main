import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, Mail, Lock, ArrowLeft, Eye, EyeOff, Sparkles, Shield, Star, Zap, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, signup, isAuthenticated, isLoading: authLoading, user } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<'customer' | 'hotel-owner' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const hasRedirectedRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Redirect if already authenticated - simplified logic
  useEffect(() => {
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
    
    // Only redirect once and if we're done loading and user is authenticated
    if (!authLoading && isAuthenticated && user && user.role && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      
      // Updated dashboard paths to match your routing
      const dashboardPath = user.role === 'hotel_owner'
        ? '/dashboard/hotel-owner' 
        : '/dashboard/customer';
      
      console.log('Redirecting to:', dashboardPath);
      
      // Use a longer timeout to prevent flooding
      navigationTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) { // Check if component is still mounted
          navigate(dashboardPath, { replace: true });
        }
      }, 500);
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
    };
  }, [isAuthenticated, user, navigate, authLoading]); // Removed debouncedNavigate from dependencies

  // Component cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('selectedRole') as 'customer' | 'hotel-owner' | null;
    setSelectedRole(role);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (type: 'login' | 'signup') => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (type === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return false;
      }

      if (!formData.first_name || !formData.last_name) {
        toast({
          title: "Validation Error",
          description: "Please enter your name",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive"
        });
        return false;
      }

      // Only check terms agreement for signup, not login
      if (!agreeToTerms) {
        toast({
          title: "Validation Error",
          description: "Please agree to the Terms of Service and Privacy Policy",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!validateForm(type)) return;
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (type === 'signup') {
        result = await signup({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          role: selectedRole === 'hotel-owner' ? 'hotel_owner' : 'customer'
        });
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        toast({
          title: `${type === 'login' ? 'Welcome back!' : 'Account Created!'} 🎉`,
          description: result.message,
        });
        if (type === 'signup') {
          // After signup, require explicit login: switch to Login tab
          setActiveTab('login');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        }
        // For login, the useEffect above will redirect to the appropriate dashboard
      } else {
        toast({
          title: "Authentication Failed",
          description: result.message,
          variant: "destructive"
        });
      }

    } catch (error: unknown) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Sparkles, text: "AI-powered hotel recommendations" },
    { icon: Zap, text: "Instant booking confirmation" },
    { icon: Shield, text: "24/7 customer support" },
    { icon: Star, text: "Exclusive member deals" }
  ];

  const [isHovered, setIsHovered] = useState(false);

  // Show loading screen while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse mx-auto">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              StayEase
            </h2>
            <p className="text-slate-600 mb-4">Loading...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting screen if user is authenticated and being redirected
  if (isAuthenticated && user && hasRedirectedRef.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse mx-auto">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              StayEase
            </h2>
            <p className="text-slate-600 mb-4">Redirecting to dashboard...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50/50 relative overflow-hidden">
          {/* Floating gradient orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />

          <div className="relative z-10 flex items-center justify-center p-12 text-center">
            <div className="max-w-lg">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3 mb-8 animate-bounce-in">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    StayEase
                  </h2>
                  <p className="text-slate-600 text-sm">AI-Powered Travel</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-4xl font-bold text-slate-900 mb-6">
                  {selectedRole === 'customer' ? 'Find Your Perfect Stay' : 'Grow Your Business'}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {selectedRole === 'customer'
                    ? 'Join millions of travelers who trust StayEase for their perfect hotel booking experience.'
                    : 'Join thousands of hotel owners maximizing their revenue with our AI-powered platform.'
                  }
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {[
                  { value: "4.9", label: "User Rating" },
                  { value: "2M+", label: "Happy Users" },
                  { value: "50K+", label: "Hotels" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-2xl font-bold text-slate-900 transition-all duration-300 group-hover:scale-110">{stat.value}</div>
                    <div className="text-sm text-slate-600 transition-all duration-300 group-hover:text-slate-900">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mb-6 text-slate-600 hover:text-slate-900 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Button>

            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StayEase</span>
                  <div className="text-xs text-slate-500">AI-Powered Booking</div>
                </div>
              </div>

              {selectedRole && (
                <div
                  className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-4 transition-all duration-300 hover:shadow-md"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {selectedRole === 'customer' ? (
                    <User className={`w-5 h-5 text-blue-600 mr-2 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  ) : (
                    <Building className={`w-5 h-5 text-purple-600 mr-2 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  )}
                  <span className="text-sm font-medium text-slate-700">
                    {selectedRole === 'customer' ? 'Customer Account' : 'Hotel Owner Account'}
                  </span>
                </div>
              )}

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome {selectedRole === 'customer' ? 'Traveler' : 'Partner'}!
              </h1>
              <p className="text-slate-600">
                {selectedRole === 'customer'
                  ? 'Sign in to discover your perfect stay'
                  : 'Access your property management dashboard'
                }
              </p>
            </div>

            {/* Auth Tabs */}
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-8 rounded-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger
                    value="login"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium transition-all duration-300"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-medium">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700 font-medium">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                            rememberMe 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'bg-white border-slate-300 hover:border-blue-500'
                          }`}>
                            <Check className={`w-3 h-3 text-white transition-opacity duration-300 ${
                              rememberMe ? 'opacity-100' : 'opacity-0'
                            }`} />
                          </div>
                        </div>
                        <span className="text-slate-600 select-none">Remember me</span>
                      </label>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
                    onClick={() => handleAuth('login')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname" className="text-slate-700 font-medium">First Name *</Label>
                        <Input
                          id="firstname"
                          type="text"
                          placeholder="John"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname" className="text-slate-700 font-medium">Last Name *</Label>
                        <Input
                          id="lastname"
                          type="text"
                          placeholder="Doe"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-700 font-medium">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-700 font-medium">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm">
                      <label className="flex items-start space-x-2 cursor-pointer">
                        <div className="relative mt-0.5">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                          />
                          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                            agreeToTerms 
                              ? 'bg-green-600 border-green-600' 
                              : 'bg-white border-slate-300 hover:border-green-500'
                          }`}>
                            <Check className={`w-3 h-3 text-white transition-opacity duration-300 ${
                              agreeToTerms ? 'opacity-100' : 'opacity-0'
                            }`} />
                          </div>
                        </div>
                        <span className="text-slate-600 leading-relaxed select-none">
                          I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">Privacy Policy</a>
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
                    onClick={() => handleAuth('signup')}
                    disabled={isLoading || !agreeToTerms}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <Sparkles className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-xs text-slate-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Shield className="w-4 h-4 mr-1 transition-transform duration-300 hover:scale-110" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;