import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Mic, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MobileVoice = () => {
  const { toast } = useToast();

  const handleDownloadApp = () => {
    toast({
      title: "Download App",
      description: "Preparing mobile app download link...",
    });
  };

  const handleVoiceCommand = () => {
    toast({
      title: "Voice Commands",
      description: "Activating voice command feature...",
    });
  };

  const handleChangeLanguage = () => {
    toast({
      title: "Language Settings",
      description: "Opening language selection menu...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mobile & Voice
          </h1>
          <p className="text-muted-foreground text-lg">
            Multilingual interface with voice commands
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Smartphone className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Mobile App</CardTitle>
              <CardDescription>
                Download for iOS and Android
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleDownloadApp}>
                Download App
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mic className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Voice Commands</CardTitle>
              <CardDescription>
                Control app with your voice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleVoiceCommand}>
                Enable Voice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Languages className="w-8 h-8 text-success mb-2" />
              <CardTitle>Languages</CardTitle>
              <CardDescription>
                Choose your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleChangeLanguage}>
                Change Language
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MobileVoice;
