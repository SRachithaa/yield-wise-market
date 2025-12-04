import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BulkMarketplace = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Search button clicked");
    if (!searchTerm.trim()) {
      toast({
        title: "Enter search term",
        description: "Please enter a product name to search",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Searching marketplace",
      description: `Looking for: ${searchTerm}`,
    });
  };

  const handleViewProducts = () => {
    console.log("View Products button clicked");
    toast({
      title: "Browse Products",
      description: "Loading available crops and produce catalog...",
    });
  };

  const handleJoinGroup = () => {
    console.log("Join Group button clicked");
    toast({
      title: "Group Selling",
      description: "Finding farmer groups in your area to join...",
    });
  };

  const handleViewTrends = () => {
    console.log("View Trends button clicked");
    toast({
      title: "Price Trends",
      description: "Loading market price trends and analytics...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bulk Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Direct farmer-to-buyer platform with transparent pricing
          </p>
        </div>

        <div className="mb-8">
          <Label htmlFor="search">Search Products</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="search"
              placeholder="Search crops, vegetables, fruits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button" onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <ShoppingCart className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Browse Products</CardTitle>
              <CardDescription>
                Explore available crops and produce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewProducts}>View All Products</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="w-8 h-8 text-success mb-2" />
              <CardTitle>Group Selling</CardTitle>
              <CardDescription>
                Join with other farmers for better rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleJoinGroup}>Join Group</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-earth mb-2" />
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Track market prices and demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" onClick={handleViewTrends}>View Trends</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkMarketplace;
