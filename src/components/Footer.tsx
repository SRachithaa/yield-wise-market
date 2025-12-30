import { Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlatformLink = (route: string) => {
    navigate(route);
  };

  const handleResourceLink = (resourceName: string) => {
    toast({
      title: resourceName,
      description: `${resourceName} page coming soon!`,
    });
  };

  const handlePolicyLink = (policyName: string) => {
    toast({
      title: policyName,
      description: `${policyName} page coming soon!`,
    });
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground">CropTrade</h3>
                <p className="text-xs text-muted-foreground">AgriLink</p>
              </div>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Revolutionizing agriculture through smart technology, connecting farmers with markets and insights.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handlePlatformLink('/bulk-marketplace')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePlatformLink('/smart-logistics')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Logistics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePlatformLink('/market-insights')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePlatformLink('/community-hub')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Community
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleResourceLink('Documentation')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleResourceLink('API Reference')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  API Reference
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleResourceLink('Help Center')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleResourceLink('Training')} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Training
                </button>
              </li>
            </ul>
          </div>

          {/* Team Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Team Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <div className="font-medium text-foreground">Rachitha S</div>
                <div>Project Manager</div>
                <div>rachitha.s@croptrade.com</div>
              </li>
              <li>
                <div className="font-medium text-foreground">Sahana N</div>
                <div>Developer</div>
                <div>sahanagowda12@croptrade.com</div>
              </li>
              <li>
                <div className="font-medium text-foreground">Ganavi B</div>
                <div>Developer</div>
                <div>ganavi.b@croptrade.com</div>
              </li>
              <li>
                <div className="font-medium text-foreground">Kruthika</div>
                <div>Developer</div>
                <div>kruthika@croptrade.com</div>
              </li>
              <li>
                <div className="font-medium text-foreground">Youkthi</div>
                <div>Developer</div>
                <div>youkthi@croptrade.com</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CropTrade AgriLink. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <button 
              onClick={() => handlePolicyLink('Privacy Policy')} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handlePolicyLink('Terms of Service')} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handlePolicyLink('Cookie Policy')} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
