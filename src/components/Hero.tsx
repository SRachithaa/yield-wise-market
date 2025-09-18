import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Truck } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/30 via-background to-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Smart Farming
                <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent block">
                  Marketplace
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Connect farmers with buyers, optimize logistics, and leverage AI-driven insights for sustainable agriculture. Transform your farming business today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2 mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Farmers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-2 mx-auto">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">₹50Cr+</div>
                <div className="text-sm text-muted-foreground">Trade Volume</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-earth/10 rounded-full mb-2 mx-auto">
                  <Truck className="w-6 h-6 text-earth" />
                </div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Transporters</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Start Trading
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Smart farming technology with farmers using tablets in crop fields"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Decorative gradient */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-primary/20 to-success/20 rounded-2xl blur-xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;