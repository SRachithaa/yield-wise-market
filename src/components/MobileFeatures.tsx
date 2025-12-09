import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, Bell, Smartphone } from "lucide-react";
import { takeCropPhoto, getCurrentLocation, initializePushNotifications } from "@/utils/mobileFeatures";
import { useToast } from "@/hooks/use-toast";

const MobileFeatures = () => {
  const { toast } = useToast();

  const handleTakePhoto = async () => {
    console.log("Take Photo button clicked");
    try {
      const photo = await takeCropPhoto();
      console.log("Photo result:", photo);
      if (photo) {
        toast({
          title: "Photo Captured!",
          description: "Crop photo saved for soil analysis",
        });
      } else {
        toast({
          title: "Camera Access",
          description: "Camera is available on mobile devices",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleTakePhoto:", error);
    }
  };

  const handleGetLocation = async () => {
    console.log("Get Location button clicked");
    try {
      const location = await getCurrentLocation();
      console.log("Location result:", location);
      if (location) {
        toast({
          title: "Location Found!",
          description: `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`,
        });
      } else {
        toast({
          title: "GPS Access",
          description: "Location services available on mobile devices",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleGetLocation:", error);
    }
  };

  const handleNotifications = async () => {
    console.log("Enable Notifications button clicked");
    try {
      await initializePushNotifications();
      toast({
        title: "Notifications Enabled!",
        description: "You'll receive price alerts and weather updates",
      });
    } catch (error) {
      console.error("Error in handleNotifications:", error);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Mobile-First
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent block">
              Farming Tools
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take advantage of smartphone capabilities for better farming decisions and real-time updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Camera Feature */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Crop Camera</CardTitle>
              <CardDescription>
                Capture soil and crop photos for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTakePhoto}
                variant="outline" 
                className="w-full"
              >
                Take Photo
              </Button>
            </CardContent>
          </Card>

          {/* GPS Feature */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-earth/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-earth" />
              </div>
              <CardTitle className="text-lg">Farm GPS</CardTitle>
              <CardDescription>
                Track field locations and optimize logistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGetLocation}
                variant="outline" 
                className="w-full"
              >
                Get Location
              </Button>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bell className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-lg">Smart Alerts</CardTitle>
              <CardDescription>
                Price updates and weather warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleNotifications}
                variant="outline" 
                className="w-full"
              >
                Enable Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Mobile App */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-lg">Mobile App</CardTitle>
              <CardDescription>
                Download for offline access and better performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "App Download",
                    description: "Mobile app download will be available soon for Android and iOS!",
                  });
                }}
              >
                Download App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Benefits */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-success/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Why Mobile-First Farming?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">📱</div>
              <h4 className="font-semibold text-foreground mb-2">Field Ready</h4>
              <p className="text-muted-foreground">Use directly in fields without internet connectivity</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">🚀</div>
              <h4 className="font-semibold text-foreground mb-2">Real-time Updates</h4>
              <p className="text-muted-foreground">Instant price alerts and weather notifications</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-earth mb-2">🌾</div>
              <h4 className="font-semibold text-foreground mb-2">Smart Decisions</h4>
              <p className="text-muted-foreground">AI-powered insights at your fingertips</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileFeatures;