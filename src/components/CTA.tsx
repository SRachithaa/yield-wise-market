import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CTA = () => {
  const { user } = useAuth();
  
  const benefits = [
    "Connect directly with buyers",
    "AI-powered farming insights",
    "Optimized logistics network",
    "Transparent pricing"
  ];

  const handleStartFreeTrial = () => {
    console.log('🆓 Start Free Trial button clicked');
    if (user) {
      console.log('🆓 User is logged in, starting trial...');
      // Could navigate to trial setup
    } else {
      console.log('🆓 User not logged in, showing sign up dialog...');
      window.dispatchEvent(new CustomEvent('openAuthDialog', { detail: { mode: 'signup' } }));
    }
  };

  const handleScheduleDemo = () => {
    console.log('📅 Schedule Demo button clicked');
    // Could open calendar booking or contact form
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-primary via-success to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-white/10 pattern-squares"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Transform Your Farming Business Today
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Join thousands of farmers already using CropTrade to increase their profits, reduce costs, and access modern agricultural technologies.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start space-x-3 text-primary-foreground/95">
                <CheckCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold group hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              onClick={handleStartFreeTrial}
            >
              {user ? 'Start Trial' : 'Start Free Trial'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground transition-all"
              onClick={handleScheduleDemo}
            >
              Schedule Demo
            </Button>
          </div>

          <p className="text-primary-foreground/80 text-sm mt-6">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;