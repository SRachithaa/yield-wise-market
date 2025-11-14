import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, User, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SmartLogistics = () => {
  const driverData = {
    name: "Rajesh Kumar",
    vehicle: "Tata Ace (KA-01-AB-1234)",
    address: "MG Road, Bangalore, Karnataka 560001",
    rating: "4.8/5",
    trips: 234
  };

  const routes = [
    { from: "Bangalore", to: "Mysore", distance: "145 km", time: "3 hrs" },
    { from: "Hubli", to: "Belgaum", distance: "95 km", time: "2 hrs" },
    { from: "Mangalore", to: "Udupi", distance: "58 km", time: "1.5 hrs" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Smart Logistics
          </h1>
          <p className="text-muted-foreground text-lg">
            Shared transportation network with GPS tracking and optimized routes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <User className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Available Driver</CardTitle>
              <CardDescription>Verified and experienced driver</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">{driverData.name}</span>
                <Badge variant="outline">{driverData.rating}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{driverData.vehicle}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{driverData.address}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Completed {driverData.trips} trips
              </div>
              <Button className="w-full mt-4" variant="default">
                Book Driver
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Popular Routes</CardTitle>
              <CardDescription>Optimized delivery routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">
                        {route.from} → {route.to}
                      </span>
                      <Badge variant="secondary">{route.time}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {route.distance}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Routes
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Track Your Shipment</CardTitle>
            <CardDescription>Real-time GPS tracking coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="hero" className="w-full">
              Enable GPS Tracking
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SmartLogistics;
