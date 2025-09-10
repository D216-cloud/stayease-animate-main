import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Building, Star, MapPin, Shield, Sparkles, TrendingUp, Calendar, Search, Zap, Play, Award, Globe, Heart, ArrowRight, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleSelect = (role: 'customer' | 'hotel-owner') => {
    toast({
      title: `${role === 'customer' ? 'Customer' : 'Hotel Owner'} Selected`,
      description: "Redirecting to login...",
    });
    
    // Store selected role for the login flow
    localStorage.setItem('selectedRole', role);
    
    setTimeout(() => {
      navigate('/auth');
    }, 1000);
  };

  const stats = [
    { icon: Building, label: "Premium Hotels", value: "75,000+", color: "from-blue-500 to-cyan-500", delay: "0s" },
    { icon: User, label: "Happy Travelers", value: "5M+", color: "from-emerald-500 to-green-500", delay: "0.1s" },
    { icon: Globe, label: "Global Cities", value: "2,500+", color: "from-purple-500 to-violet-500", delay: "0.2s" },
    { icon: Award, label: "Trust Rating", value: "4.9/5", color: "from-amber-500 to-orange-500", delay: "0.3s" }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Advanced machine learning algorithms analyze millions of data points to find your perfect match.",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      benefits: ["Personalized results", "Smart filtering", "Preference learning"]
    },
    {
      icon: Zap,
      title: "Lightning-Fast Booking",
      description: "Complete your reservation in under 30 seconds with our streamlined, one-click booking system.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      benefits: ["Instant confirmation", "Secure payments", "Mobile optimized"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and PCI compliance ensure your data and payments are always protected.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      benefits: ["256-bit encryption", "Fraud protection", "Privacy first"]
    },
    {
      icon: TrendingUp,
      title: "Revenue Intelligence",
      description: "Hotel owners get real-time analytics, demand forecasting, and automated pricing optimization.",
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      benefits: ["Revenue analytics", "Market insights", "Dynamic pricing"]
    },
    {
      icon: Calendar,
      title: "Flexible Management",
      description: "Free cancellations, easy modifications, and 24/7 support for complete peace of mind.",
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      benefits: ["Free cancellation", "Easy modifications", "24/7 support"]
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Revolutionary search technology that understands context and finds hidden gems you'll love.",
      gradient: "from-cyan-500 via-teal-500 to-emerald-500",
      benefits: ["Context-aware search", "Hidden gems", "Local insights"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      {/* Enhanced Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg' 
          : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/30'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LuxStay
                </span>
                <div className="text-xs text-slate-500 font-medium">Premium Stays</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors font-medium relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all" />
              </a>
              <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition-colors font-medium relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all" />
              </a>
              <a href="#about" className="text-slate-700 hover:text-blue-600 transition-colors font-medium relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all" />
              </a>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-amber-700">4.9</span>
                <span className="text-xs text-amber-600">(12,847)</span>
              </div>
            </nav>
            
            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-slate-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-medium"
              >
                Get Started Free
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50">
              <nav className="flex flex-col space-y-4 px-4">
                <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">Features</a>
                <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">Pricing</a>
                <a href="#about" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">About</a>
                <div className="border-t border-slate-200 pt-4 flex flex-col space-y-3">
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/auth')}
                    className="justify-start"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl"
                  >
                    Get Started Free
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <main className="pt-20">
        
        {/* Revolutionary Role Selection */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/50 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Choose Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Adventure Path
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Whether you're exploring the world or sharing it with others, we've crafted the perfect experience for you.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Enhanced Traveler Card */}
              <Card 
                className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative"
                onClick={() => handleRoleSelect('customer')}
              >
                {/* Floating gradient orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                
                <div className="p-10 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all group-hover:rotate-3">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-40 transition-all" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">Starting from</div>
                      <div className="text-2xl font-bold text-slate-900">Free</div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    I'm a Traveler 🌟
                  </h3>
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                    Discover extraordinary accommodations with our AI-powered matching system. Get personalized recommendations, 
                    instant bookings, and exclusive deals tailored to your travel style.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Sparkles, text: "AI-Powered Hotel Matching" },
                      { icon: Zap, text: "Lightning-Fast Bookings" },
                      { icon: Heart, text: "Personalized Recommendations" },
                      { icon: Shield, text: "Secure Payment Protection" }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl group-hover:scale-105 transition-all">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>

              {/* Enhanced Hotel Owner Card */}
              <Card 
                className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative"
                onClick={() => handleRoleSelect('hotel-owner')}
              >
                {/* Floating gradient orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
                
                <div className="p-10 relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all group-hover:rotate-3">
                        <Building className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl blur opacity-0 group-hover:opacity-40 transition-all" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">Commission</div>
                      <div className="text-2xl font-bold text-slate-900">3.5%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    I Own a Hotel 🏨
                  </h3>
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                    Maximize your revenue with intelligent analytics, automated pricing optimization, and seamless booking management. 
                    Connect with travelers worldwide.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: TrendingUp, text: "Revenue Analytics & Insights" },
                      { icon: Calendar, text: "Smart Booking Management" },
                      { icon: Globe, text: "Global Traveler Network" },
                      { icon: Award, text: "Premium Support & Tools" }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl group-hover:scale-105 transition-all">
                    Grow Your Business
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Next-Gen Features Section */}
        <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center rounded-full px-6 py-3 mb-6 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-700">Powered by Advanced AI</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
                Why Travelers Choose
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LuxStay
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Experience the next generation of hotel booking with cutting-edge technology, 
                personalized service, and features designed for modern travelers.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative p-8 rounded-3xl"
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Feature benefits */}
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className={`w-6 h-6 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center opacity-80`}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover effect indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className={`w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center`}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ultimate CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center rounded-full px-6 py-3 mb-6 bg-white/20 backdrop-blur-sm border border-white/30">
                  <Star className="w-5 h-5 text-yellow-300 mr-2" />
                  <span className="text-sm font-semibold text-white">Join 5M+ Happy Travelers</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Ready to Transform Your
                  <span className="block text-yellow-300">
                    Travel Experience?
                  </span>
                </h2>
                
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Join millions of travelers who have discovered the perfect way to book hotels. 
                  Start your journey with AI-powered recommendations today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all min-w-[220px]"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-2xl text-lg font-semibold transition-all min-w-[220px]"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "99.9%", label: "Uptime" },
                  { value: "< 30s", label: "Avg Booking Time" },
                  { value: "24/7", label: "Support" },
                  { value: "0%", label: "Hidden Fees" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-white">
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StayEase</span>
                  <div className="text-xs text-slate-400 font-medium">AI-Powered Travel</div>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md">
                The future of hotel booking, powered by AI. Connecting travelers with their perfect stays since 2024.
              </p>
              <div className="flex items-center space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all">
                    <div className="w-5 h-5 bg-slate-400 rounded" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Links sections */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Product</h3>
              <ul className="space-y-3">
                {['Features', 'AI Matching', 'Mobile App', 'API Access', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors hover:underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors hover:underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-slate-400 text-center md:text-left mb-4 md:mb-0">
                &copy; 2025 LuxStay. All rights reserved. Made with ❤️ for travelers worldwide.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <span>🌍 Available in 50+ languages</span>
                <span>🔒 SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;