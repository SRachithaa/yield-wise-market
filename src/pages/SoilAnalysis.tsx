import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Leaf, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SoilAnalysis = () => {
  const { toast } = useToast();

  const handleTestSoil = () => {
    toast({
      title: "Soil Testing",
      description: "Initiating soil sample collection process...",
    });
  };

  const handleGetRecommendations = () => {
    toast({
      title: "Crop Recommendations",
      description: "Analyzing soil data for optimal crop suggestions...",
    });
  };

  const handleViewReports = () => {
    toast({
      title: "Analysis Reports",
      description: "Loading your soil analysis history...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Soil Analysis
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered soil testing and fertilizer recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FlaskConical className="w-8 h-8 text-success mb-2" />
              <CardTitle>Test Your Soil</CardTitle>
              <CardDescription>
                Get comprehensive soil analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleTestSoil}>
                Start Test
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Leaf className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Crop Recommendations</CardTitle>
              <CardDescription>
                Best crops based on your soil type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleGetRecommendations}>
                Get Suggestions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Analysis Reports</CardTitle>
              <CardDescription>
                View past soil test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewReports}>
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SoilAnalysis;
