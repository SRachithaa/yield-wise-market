import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarketInsights = () => {
  const { toast } = useToast();

  const handleViewPrices = () => {
    toast({
      title: "Price Trends",
      description: "Loading current market prices...",
    });
  };

  const handleDemandForecast = () => {
    toast({
      title: "Demand Forecast",
      description: "Analyzing demand predictions for crops...",
    });
  };

  const handlePlanCrops = () => {
    toast({
      title: "Crop Planning",
      description: "Getting planting recommendations based on market data...",
    });
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

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Current market prices and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewPrices}>
                View Prices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-success mb-2" />
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>
                Predicted demand for different crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleDemandForecast}>
                View Forecast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Crop Planning</CardTitle>
              <CardDescription>
                What to plant for best returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handlePlanCrops}>
                Get Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketInsights;
