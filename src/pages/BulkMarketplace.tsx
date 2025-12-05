import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, TrendingUp, Search, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ListCropDialog from "@/components/ListCropDialog";

interface Crop {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  location: string | null;
  description: string | null;
  status: string | null;
  user_id: string;
  created_at: string | null;
}

const BulkMarketplace = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crops")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCrops(data || []);
      setFilteredCrops(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading crops",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCrops(crops);
      return;
    }

    setSearching(true);
    const term = searchTerm.toLowerCase();
    const results = crops.filter(
      (crop) =>
        crop.name.toLowerCase().includes(term) ||
        crop.category.toLowerCase().includes(term) ||
        crop.location?.toLowerCase().includes(term)
    );
    setFilteredCrops(results);
    setSearching(false);

    toast({
      title: `Found ${results.length} result${results.length !== 1 ? "s" : ""}`,
      description: results.length > 0 ? `Showing crops matching "${searchTerm}"` : "Try a different search term",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleContactSeller = (crop: Crop) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Contact Request Sent",
      description: `We'll connect you with the seller of ${crop.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bulk Marketplace
            </h1>
            <p className="text-muted-foreground text-lg">
              Direct farmer-to-buyer platform with transparent pricing
            </p>
          </div>
          <ListCropDialog onSuccess={fetchCrops} />
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <Label htmlFor="search">Search Products</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="search"
              placeholder="Search crops, vegetables, fruits, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button type="button" onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="groups">Group Selling</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCrops.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No crops available</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "Try a different search term" : "Be the first to list your crops!"}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => { setSearchTerm(""); setFilteredCrops(crops); }}>
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop) => (
                  <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{crop.name}</CardTitle>
                          <CardDescription>{crop.category}</CardDescription>
                        </div>
                        <Badge variant="secondary">{crop.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{crop.quantity} {crop.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary">₹{crop.price_per_unit}/{crop.unit}</span>
                      </div>
                      {crop.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {crop.location}
                        </div>
                      )}
                      {crop.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
                      )}
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleContactSeller(crop)}
                        disabled={crop.user_id === user?.id}
                      >
                        {crop.user_id === user?.id ? "Your Listing" : "Contact Seller"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <Package className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Group Selling</CardTitle>
                <CardDescription>
                  Join with other farmers to sell in bulk and get better rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Group selling allows multiple farmers to combine their produce and negotiate better prices with buyers.
                </p>
                <div className="grid gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Rice Farmers Collective</h4>
                      <p className="text-sm text-muted-foreground mb-2">12 members • Karnataka Region</p>
                      <Button size="sm" variant="outline">Request to Join</Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Vegetable Growers Union</h4>
                      <p className="text-sm text-muted-foreground mb-2">8 members • Tamil Nadu Region</p>
                      <Button size="sm" variant="outline">Request to Join</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Market Price Trends</CardTitle>
                <CardDescription>
                  Track commodity prices and market demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Rice (Basmati)</p>
                      <p className="text-sm text-muted-foreground">Per quintal</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹4,500</p>
                      <p className="text-sm text-green-600">↑ 5.2%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Wheat</p>
                      <p className="text-sm text-muted-foreground">Per quintal</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹2,800</p>
                      <p className="text-sm text-red-600">↓ 1.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Tomato</p>
                      <p className="text-sm text-muted-foreground">Per kg</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹45</p>
                      <p className="text-sm text-green-600">↑ 12.3%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default BulkMarketplace;
