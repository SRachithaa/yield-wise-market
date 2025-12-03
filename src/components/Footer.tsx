import { Sprout } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">CropTrade</h3>
                <p className="text-xs text-muted-foreground">AgriLink</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Revolutionizing agriculture through smart technology, connecting farmers with markets and insights.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#marketplace" className="hover:text-primary transition-colors">Marketplace</a></li>
              <li><a href="#logistics" className="hover:text-primary transition-colors">Logistics</a></li>
              <li><a href="#insights" className="hover:text-primary transition-colors">AI Insights</a></li>
              <li><a href="#community" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Training</a></li>
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
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CropTrade AgriLink. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;