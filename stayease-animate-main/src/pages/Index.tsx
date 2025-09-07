// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Landing page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="loading-spinner w-8 h-8 rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to StayEase...</p>
      </div>
    </div>
  );
};

export default Index;
