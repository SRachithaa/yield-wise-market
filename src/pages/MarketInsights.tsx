import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target, ArrowUp, ArrowDown, Minus } from "lucide-react";

const MarketInsights = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const priceData = [
    { crop: "Rice", price: "₹2,450/quintal", change: "+5.2%", trend: "up" },
    { crop: "Wheat", price: "₹2,125/quintal", change: "+2.8%", trend: "up" },
    { crop: "Maize", price: "₹1,890/quintal", change: "-1.5%", trend: "down" },
    { crop: "Cotton", price: "₹6,200/quintal", change: "+8.1%", trend: "up" },
    { crop: "Sugarcane", price: "₹350/quintal", change: "0%", trend: "stable" },
    { crop: "Soybean", price: "₹4,100/quintal", change: "-2.3%", trend: "down" },
  ];

  const demandData = [
    { crop: "Rice", demand: "High", forecast: "Increasing demand expected in next 3 months" },
    { crop: "Vegetables", demand: "Very High", forecast: "Peak season approaching, prices may rise" },
    { crop: "Pulses", demand: "Medium", forecast: "Stable demand, good for long-term storage" },
    { crop: "Fruits", demand: "High", forecast: "Export demand growing, premium prices expected" },
    { crop: "Spices", demand: "Medium", forecast: "Seasonal fluctuation expected" },
  ];

  const recommendations = [
    { crop: "Tomatoes", roi: "High", reason: "Peak demand in 2 months, plant now for best returns" },
    { crop: "Onions", roi: "Medium-High", reason: "Storage friendly, prices typically rise in off-season" },
    { crop: "Green Gram", roi: "Medium", reason: "Low input cost, consistent market demand" },
    { crop: "Chillies", roi: "High", reason: "Export demand strong, premium quality fetches 2x price" },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-success" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Market Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Demand forecasting and price predictions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={activeSection === "prices" ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Current market prices and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                type="button" 
                variant={activeSection === "prices" ? "default" : "outline"} 
                className="w-full" 
                onClick={() => setActiveSection(activeSection === "prices" ? null : "prices")}
              >
                {activeSection === "prices" ? "Hide Prices" : "View Prices"}
              </Button>
            </CardContent>
          </Card>

          <Card className={activeSection === "forecast" ? "ring-2 ring-success" : ""}>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-success mb-2" />
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>
                Predicted demand for different crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                type="button" 
                variant={activeSection === "forecast" ? "default" : "outline"} 
                className="w-full" 
                onClick={() => setActiveSection(activeSection === "forecast" ? null : "forecast")}
              >
                {activeSection === "forecast" ? "Hide Forecast" : "View Forecast"}
              </Button>
            </CardContent>
          </Card>

          <Card className={activeSection === "planning" ? "ring-2 ring-earth" : ""}>
            <CardHeader>
              <Target className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Crop Planning</CardTitle>
              <CardDescription>
                What to plant for best returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                type="button" 
                variant={activeSection === "planning" ? "default" : "outline"} 
                className="w-full" 
                onClick={() => setActiveSection(activeSection === "planning" ? null : "planning")}
              >
                {activeSection === "planning" ? "Hide Recommendations" : "Get Recommendations"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Price Trends Section */}
        {activeSection === "prices" && (
          <Card className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Current Market Prices
              </CardTitle>
              <CardDescription>Updated today at 9:00 AM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceData.map((item) => (
                  <div key={item.crop} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.crop}</p>
                      <p className="text-lg font-bold text-primary">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                      <span className={item.trend === "up" ? "text-success" : item.trend === "down" ? "text-destructive" : "text-muted-foreground"}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demand Forecast Section */}
        {activeSection === "forecast" && (
          <Card className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-success" />
                Demand Forecast
              </CardTitle>
              <CardDescription>3-month outlook based on market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandData.map((item) => (
                  <div key={item.crop} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{item.crop}</p>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item.demand === "Very High" ? "bg-success/20 text-success" :
                        item.demand === "High" ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.demand} Demand
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.forecast}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crop Planning Section */}
        {activeSection === "planning" && (
          <Card className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-earth" />
                Recommended Crops to Plant
              </CardTitle>
              <CardDescription>Based on current market conditions and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {recommendations.map((item) => (
                  <div key={item.crop} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-foreground">{item.crop}</p>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item.roi === "High" ? "bg-success/20 text-success" :
                        "bg-primary/20 text-primary"
                      }`}>
                        {item.roi} ROI
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MarketInsights;
