import { Button } from "@/components/ui/button";
import { Sprout, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Listen for custom events from other components
  React.useEffect(() => {
    const handleOpenAuthDialog = (event: CustomEvent) => {
      console.log('📡 Received openAuthDialog event:', event.detail);
      setAuthMode(event.detail.mode);
      setAuthDialogOpen(true);
    };

    window.addEventListener('openAuthDialog', handleOpenAuthDialog as EventListener);
    return () => window.removeEventListener('openAuthDialog', handleOpenAuthDialog as EventListener);
  }, []);

  const toggleMenu = () => {
    console.log('📱 Mobile menu toggled:', !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignIn = () => {
    console.log('🔐 Sign In  clicked');
    setAuthMode('signin');
    setAuthDialogOpen(true);
  };

  const handleGetStarted = () => {
    console.log('🚀 Get Started button clicked');
    if (user) {
      console.log('🚀 User already signed in, navigating to dashboard...');
      // Could navigate to dashboard here
    } else {
      setAuthMode('signup');
      setAuthDialogOpen(true);
    }
  };

  const handleSignOut = async () => {
    console.log('🔐 Sign Out button clicked');
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-success rounded-lg">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-foreground">CropTrade</h1>
              <p className="text-xs text-muted-foreground">Crop</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/bulk-marketplace')} className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </button>
            <button onClick={() => navigate('/smart-logistics')} className="text-foreground hover:text-primary transition-colors">
              Logistics
            </button>
            <button onClick={() => navigate('/market-insights')} className="text-foreground hover:text-primary transition-colors">
              AI Insights
            </button>
            <button onClick={() => navigate('/community-hub')} className="text-foreground hover:text-primary transition-colors">
              Community
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button variant="hero" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => { navigate('/bulk-marketplace'); setIsMenuOpen(false); }} className="text-foreground hover:text-primary transition-colors py-2 text-left">
                Marketplace
              </button>
              <button onClick={() => { navigate('/smart-logistics'); setIsMenuOpen(false); }} className="text-foreground hover:text-primary transition-colors py-2 text-left">
                Logistics
              </button>
              <button onClick={() => { navigate('/market-insights'); setIsMenuOpen(false); }} className="text-foreground hover:text-primary transition-colors py-2 text-left">
                AI Insights
              </button>
              <button onClick={() => { navigate('/community-hub'); setIsMenuOpen(false); }} className="text-foreground hover:text-primary transition-colors py-2 text-left">
                Community
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground px-2">
                      Welcome, {user.email}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={handleSignIn}>
                      Sign In
                    </Button>
                    <Button variant="hero" className="w-full" onClick={handleGetStarted}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        mode={authMode} 
      />
    </header>
  );
};

export default Header;
