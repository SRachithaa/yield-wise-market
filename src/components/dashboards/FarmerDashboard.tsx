import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, DollarSign, Plus, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ListCropDialog from '@/components/ListCropDialog';

interface Crop {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  status: string;
  location: string | null;
  created_at: string;
}

interface Trade {
  id: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch crops
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cropsError) throw cropsError;
      setCrops(cropsData || []);

      // Fetch trades where user is seller
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);
    } catch (error) {
      console.error('Error fetching farmer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const totalCrops = crops.length;
  const activeCrops = crops.filter(c => c.status === 'available').length;
  const completedTrades = trades.filter(t => t.status === 'completed').length;
  const totalRevenue = trades
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <ListCropDialog onSuccess={fetchData} />
        <Button variant="outline" onClick={() => navigate('/smart-logistics')}>
          <Truck className="w-4 h-4 mr-2" />
          Request Transport
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Crops</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCrops}</div>
            <p className="text-xs text-muted-foreground">
              {activeCrops} available for sale
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTrades}</div>
            <p className="text-xs text-muted-foreground">
              Total trades completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From completed sales
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-earth" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trades.length > 0 ? Math.round((completedTrades / trades.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Trade completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Crop Listings */}
      <Card>
        <CardHeader>
          <CardTitle>My Crop Listings</CardTitle>
          <CardDescription>Manage your agricultural products</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : crops.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No crops listed yet</p>
              <ListCropDialog onSuccess={fetchData} />
            </div>
          ) : (
            <div className="space-y-4">
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {crop.category} • {crop.quantity} {crop.unit}
                      {crop.location && ` • ${crop.location}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{crop.price_per_unit}/{crop.unit}</p>
                    <Badge variant={crop.status === 'available' ? 'default' : 'secondary'}>
                      {crop.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Trades */}
      {trades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your selling activity</CardDescription>
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
