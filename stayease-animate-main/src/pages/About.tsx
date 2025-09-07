import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building, ArrowLeft, Users, Star, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StayEase</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">StayEase</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Revolutionizing the hospitality industry with AI-powered booking solutions 
            that connect travelers with their perfect accommodations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">For Travelers</h3>
            <p className="text-muted-foreground">
              Discover and book amazing hotels with our intelligent matching system 
              that understands your preferences and budget.
            </p>
          </Card>

          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">For Hotel Owners</h3>
            <p className="text-muted-foreground">
              Maximize your occupancy and revenue with our comprehensive 
              property management and analytics platform.
            </p>
          </Card>

          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Quality Assured</h3>
            <p className="text-muted-foreground">
              Every property on our platform is verified and rated by real guests 
              to ensure exceptional experiences.
            </p>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            To make travel booking effortless and property management intelligent, 
            creating value for both travelers and hospitality businesses worldwide.
          </p>
          <Button className="btn-hero" onClick={() => navigate('/auth')}>
            Join StayEase Today
          </Button>
        </div>
      </main>
    </div>
  );
};

export default About;