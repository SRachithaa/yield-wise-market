import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Truck, Package, MapPin, Clock, CheckCircle2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransporterDetails {
  id: string;
  vehicle_type: string;
  vehicle_number: string;
  capacity: string;
  service_area: string;
  is_available: boolean;
}

interface TransportRequest {
  id: string;
  pickup_location: string;
  delivery_location: string;
  status: string;
  notes: string | null;
  created_at: string;
  crop_id: string | null;
}

export const TransporterDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [details, setDetails] = useState<TransporterDetails | null>(null);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch transporter details
      const { data: transporterData, error: transporterError } = await supabase
        .from('transporters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (transporterError) throw transporterError;
      setDetails(transporterData);

      // Fetch accepted transport requests
      const { data: acceptedData, error: acceptedError } = await supabase
        .from('transport_requests')
        .select('*')
        .eq('transporter_id', user.id)
        .order('created_at', { ascending: false });

      if (acceptedError) throw acceptedError;
      setRequests(acceptedData || []);

      // Fetch pending transport requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('transport_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingRequests(pendingData || []);
    } catch (error) {
      console.error('Error fetching transporter data:', error);
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

  const toggleAvailability = async () => {
    if (!details) return;

    try {
      const { error } = await supabase
        .from('transporters')
        .update({ is_available: !details.is_available })
        .eq('id', details.id);

      if (error) throw error;

      setDetails({ ...details, is_available: !details.is_available });
      toast({
        title: 'Status Updated',
        description: `You are now ${!details.is_available ? 'available' : 'unavailable'} for transport requests`,
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive',
      });
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transport_requests')
        .update({ transporter_id: user.id, status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Request Accepted',
        description: 'You have accepted this transport request',
      });

      fetchData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept request',
        variant: 'destructive',
      });
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('transport_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Request marked as ${newStatus}`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const completedTrips = requests.filter(r => r.status === 'delivered').length;
  const activeTrips = requests.filter(r => r.status === 'in_transit').length;

  return (
    <div className="space-y-6">
      {/* Vehicle Card */}
      {details && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>My Vehicle</CardTitle>
                  <CardDescription>{details.vehicle_number}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="availability">Available</Label>
                <Switch
                  id="availability"
                  checked={details.is_available}
                  onCheckedChange={toggleAvailability}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Vehicle Type</p>
                <p className="font-medium">{details.vehicle_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="font-medium">{details.capacity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service Area</p>
                <p className="font-medium">{details.service_area}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={details.is_available ? 'default' : 'secondary'}>
                  {details.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips}</div>
            <p className="text-xs text-muted-foreground">Currently in transit</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTrips}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Available Transport Requests</CardTitle>
          <CardDescription>Accept requests to start transporting</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pending transport requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-success" />
                      <span className="text-sm">{request.pickup_location}</span>
                      <span className="text-muted-foreground">→</span>
                      <MapPin className="w-4 h-4 text-destructive" />
                      <span className="text-sm">{request.delivery_location}</span>
                    </div>
                    {request.notes && (
                      <p className="text-xs text-muted-foreground">{request.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Posted {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => acceptRequest(request.id)} size="sm">
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Trips */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Trips</CardTitle>
            <CardDescription>Accepted and completed transport jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-success" />
                      <span className="text-sm">{request.pickup_location}</span>
                      <span className="text-muted-foreground">→</span>
                      <MapPin className="w-4 h-4 text-destructive" />
                      <span className="text-sm">{request.delivery_location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      request.status === 'delivered' ? 'default' :
                      request.status === 'in_transit' ? 'secondary' : 'outline'
                    }>
                      {request.status}
                    </Badge>
                    {request.status === 'accepted' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRequestStatus(request.id, 'in_transit')}
                      >
                        Start Trip
                      </Button>
                    )}
                    {request.status === 'in_transit' && (
                      <Button
                        size="sm"
                        onClick={() => updateRequestStatus(request.id, 'delivered')}
                      >
                        Mark Delivered
                      </Button>
                    )}
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
