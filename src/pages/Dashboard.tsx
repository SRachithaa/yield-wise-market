import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import { TrendingUp, Package, DollarSign, MapPin, User, Phone, Edit } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  user_type: string | null;
  avatar_url: string | null;
}

interface Crop {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  status: string;
  created_at: string;
}

interface Trade {
  id: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
  crop_id: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user's crops
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cropsError) throw cropsError;
      setCrops(cropsData || []);

      // Fetch user's trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const totalCrops = crops.length;
  const activeCrops = crops.filter(c => c.status === 'available').length;
  const totalTrades = trades.length;
  const completedTrades = trades.filter(t => t.status === 'completed').length;
  const totalRevenue = trades
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.total_amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary via-success to-accent" />
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-16 relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name?.[0] || user?.email?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile?.full_name || 'User'}
                    </h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    {profile?.user_type && (
                      <Badge className="mt-2 capitalize">{profile.user_type}</Badge>
                    )}
                  </div>
                  <Button variant="outline" className="md:self-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCrops}</div>
              <p className="text-xs text-muted-foreground">
                {activeCrops} active listings
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrades}</div>
              <p className="text-xs text-muted-foreground">
                {completedTrades} completed
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
                From completed trades
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <User className="h-4 w-4 text-earth" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTrades > 0 ? Math.round((completedTrades / totalTrades) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Trade completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Crops and Trading History */}
        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crops">My Crops</TabsTrigger>
            <TabsTrigger value="trades">Trading History</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Crop Listings</CardTitle>
                <CardDescription>
                  Manage your agricultural products and listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {crops.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No crops listed yet</p>
                    <Button>List Your First Crop</Button>
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
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View all your buying and selling activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No trades yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trades.map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
