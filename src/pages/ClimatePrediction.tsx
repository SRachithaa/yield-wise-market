import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudRain, Bug, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClimatePrediction = () => {
  const { toast } = useToast();

  const handleViewWeather = () => {
    toast({
      title: "Weather Forecast",
      description: "Loading 7-day weather predictions for your area...",
    });
  };

  const handlePestAlerts = () => {
    toast({
      title: "Pest Alerts",
      description: "Checking pest outbreak predictions...",
    });
  };

  const handleSeasonalForecast = () => {
    toast({
      title: "Seasonal Forecast",
      description: "Analyzing long-term climate patterns...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Climate Prediction
          </h1>
          <p className="text-muted-foreground text-lg">
            Weather forecasting and pest outbreak predictions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CloudRain className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Weather Forecast</CardTitle>
              <CardDescription>
                7-day weather predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewWeather}>
                View Forecast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bug className="w-8 h-8 text-destructive mb-2" />
              <CardTitle>Pest Alerts</CardTitle>
              <CardDescription>
                Pest outbreak early warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handlePestAlerts}>
                Check Alerts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Seasonal Forecast</CardTitle>
              <CardDescription>
                Long-term climate patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleSeasonalForecast}>
                View Forecast
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClimatePrediction;
