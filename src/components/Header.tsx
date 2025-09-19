import { Button } from "@/components/ui/button";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-success rounded-lg">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CropTrade</h1>
              <p className="text-xs text-muted-foreground">Crop trade</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="#logistics" className="text-foreground hover:text-primary transition-colors">
              Logistics
            </a>
            <a href="#insights" className="text-foreground hover:text-primary transition-colors">
              AI Insights
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors">
              Community
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline">Sign In</Button>
            <Button variant="hero">Get Started</Button>
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
              <a href="#marketplace" className="text-foreground hover:text-primary transition-colors py-2">
                Marketplace
              </a>
              <a href="#logistics" className="text-foreground hover:text-primary transition-colors py-2">
                Logistics
              </a>
              <a href="#insights" className="text-foreground hover:text-primary transition-colors py-2">
                AI Insights
              </a>
              <a href="#community" className="text-foreground hover:text-primary transition-colors py-2">
                Community
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button variant="hero" className="w-full">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
