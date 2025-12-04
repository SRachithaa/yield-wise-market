import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommunityHub = () => {
  const { toast } = useToast();

  const handleJoinForum = () => {
    toast({
      title: "Community Forum",
      description: "Opening farmer discussion forums...",
    });
  };

  const handleExpertChat = () => {
    toast({
      title: "Expert Chat",
      description: "Connecting you with agricultural experts...",
    });
  };

  const handleViewSchemes = () => {
    toast({
      title: "Government Schemes",
      description: "Loading available government schemes and subsidies...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Community Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with farmers and agricultural experts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-success mb-2" />
              <CardTitle>Farmer Forum</CardTitle>
              <CardDescription>
                Discuss with fellow farmers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleJoinForum}>
                Join Forum
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Expert Chat</CardTitle>
              <CardDescription>
                Get advice from agri experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleExpertChat}>
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Government Schemes</CardTitle>
              <CardDescription>
                Access subsidies and programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewSchemes}>
                View Schemes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityHub;
