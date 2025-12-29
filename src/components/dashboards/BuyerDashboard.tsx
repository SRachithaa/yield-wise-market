import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package, MapPin, Phone, User, Search, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CropWithFarmer {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  location: string | null;
  user_id: string;
  farmer_name?: string;
  farmer_phone?: string;
  farmer_location?: string;
}

interface Trade {
  id: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export const BuyerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crops, setCrops] = useState<CropWithFarmer[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch available crops with farmer profiles
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (cropsError) throw cropsError;

      // Fetch farmer profiles for each crop
      const cropsWithFarmers: CropWithFarmer[] = [];
      for (const crop of cropsData || []) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, location')
          .eq('id', crop.user_id)
          .maybeSingle();

        cropsWithFarmers.push({
          ...crop,
          farmer_name: profileData?.full_name || 'Unknown Farmer',
          farmer_phone: profileData?.phone || undefined,
          farmer_location: profileData?.location || undefined,
        });
      }

      setCrops(cropsWithFarmers);

      // Fetch buyer's trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load marketplace data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactFarmer = (crop: CropWithFarmer) => {
    if (crop.farmer_phone) {
      toast({
        title: 'Contact Farmer',
        description: `Call ${crop.farmer_name} at ${crop.farmer_phone}`,
      });
    } else {
      toast({
        title: 'Contact Unavailable',
        description: 'Farmer has not added contact details',
        variant: 'destructive',
      });
    }
  };

  const completedPurchases = trades.filter(t => t.status === 'completed').length;
  const totalSpent = trades
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => navigate('/bulk-marketplace')}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Browse Full Marketplace
        </Button>
        <Button variant="outline" onClick={() => navigate('/market-insights')}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Market Insights
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Crops</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <p className="text-xs text-muted-foreground">From verified farmers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPurchases}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">On completed purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Crop Marketplace */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Marketplace</CardTitle>
          <CardDescription>Browse and purchase from local farmers</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops, categories, or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading marketplace...</div>
          ) : filteredCrops.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No crops available matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCrops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{crop.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">{crop.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">₹{crop.price_per_unit}</p>
                        <p className="text-xs text-muted-foreground">per {crop.unit}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{crop.quantity} {crop.unit} available</span>
                    </div>
                    
                    {crop.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{crop.location}</span>
                      </div>
                    )}

                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Seller:</p>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{crop.farmer_name}</span>
                      </div>
                      {crop.farmer_location && (
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{crop.farmer_location}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleContactFarmer(crop)}
                      className="w-full mt-2"
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Farmer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase History */}
      {trades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trades.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(trade.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm">Quantity: {trade.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{Number(trade.total_amount).toLocaleString()}</p>
                    <Badge variant={
                      trade.status === 'completed' ? 'default' :
                      trade.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {trade.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
