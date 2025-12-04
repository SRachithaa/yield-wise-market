import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Truck, 
  FlaskConical, 
  CloudRain, 
  TrendingUp, 
  Users, 
  Smartphone,
  DollarSign 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  
  const features = [
    {
      id: "bulk-marketplace",
      route: "/bulk-marketplace",
      icon: ShoppingCart,
      title: "Bulk Marketplace",
      description: "Direct farmer-to-buyer platform with transparent pricing and group selling options for better rates.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: "smart-logistics",
      route: "/smart-logistics",
      icon: Truck,
      title: "Smart Logistics",
      description: "Shared transportation network with GPS tracking and ML-optimized route planning to reduce costs.",
      color: "text-earth",
      bgColor: "bg-earth/10"
    },
    {
      id: "soil-analysis",
      route: "/soil-analysis",
      icon: FlaskConical,
      title: "Soil Analysis",
      description: "AI-powered soil testing recommendations for optimal fertilizer usage and crop selection.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: "climate-prediction",
      route: "/climate-prediction",
      icon: CloudRain,
      title: "Climate Prediction",
      description: "Weather forecasting and pest outbreak prediction using satellite data and machine learning.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      id: "market-insights",
      route: "/market-insights",
      icon: TrendingUp,
      title: "Market Insights",
      description: "Demand forecasting and price predictions to help farmers make informed planting decisions.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: "community-hub",
      route: "/community-hub",
      icon: Users,
      title: "Community Hub",
      description: "Connect with fellow farmers, agricultural experts, and access government scheme information.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: "mobile-voice",
      route: "/mobile-voice",
      icon: Smartphone,
      title: "Mobile & Voice",
      description: "Multilingual interface with voice commands for easy access by farmers of all literacy levels.",
      color: "text-earth",
      bgColor: "bg-earth/10"
    },
    {
      id: "digital-payments",
      route: "/digital-payments",
      icon: DollarSign,
      title: "Digital Payments",
      description: "Secure payment processing with microloan options and transparent transaction history.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    navigate(feature.route);
  };

  const handleKeyDown = (event: React.KeyboardEvent, feature: typeof features[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFeatureClick(feature);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Complete Agricultural
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent block">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From soil analysis to market prediction, CropTrade provides all the tools farmers need to succeed in modern agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/50 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/5 active:scale-95"
                onClick={() => handleFeatureClick(feature)}
                onKeyDown={(e) => handleKeyDown(e, feature)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${feature.title} feature`}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-active:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${feature.color} group-hover:drop-shadow-lg`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Click to explore →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;