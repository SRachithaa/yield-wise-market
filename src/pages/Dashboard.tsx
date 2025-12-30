import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import { ProfileEditDialog } from '@/components/ProfileEditDialog';
import { RoleSelectionDialog } from '@/components/RoleSelectionDialog';
import { TransporterOnboardingDialog } from '@/components/TransporterOnboardingDialog';
import { FarmerDashboard } from '@/components/dashboards/FarmerDashboard';
import { BuyerDashboard } from '@/components/dashboards/BuyerDashboard';
import { TransporterDashboard } from '@/components/dashboards/TransporterDashboard';
import { MapPin, Phone, Edit, Tractor, ShoppingCart, Truck } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  payment_method?: string | null;
};

const roleIcons = {
  farmer: Tractor,
  buyer: ShoppingCart,
  transporter: Truck,
};

const roleColors = {
  farmer: 'bg-success/10 text-success border-success/30',
  buyer: 'bg-primary/10 text-primary border-primary/30',
  transporter: 'bg-accent/10 text-accent border-accent/30',
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, hasTransporterDetails, setHasTransporterDetails, setUserRole } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showTransporterOnboarding, setShowTransporterOnboarding] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Show role selection if user has no role (fallback for users who signed up before role selection was added)
    if (!roleLoading && !loading && user && role === null) {
      setShowRoleSelection(true);
    } else {
      setShowRoleSelection(false);
    }
  }, [role, roleLoading, loading, user]);

  useEffect(() => {
    // Show transporter onboarding if they haven't added vehicle details
    if (!roleLoading && role === 'transporter' && !hasTransporterDetails) {
      setShowTransporterOnboarding(true);
    }
  }, [role, roleLoading, hasTransporterDetails]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData as Profile | null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelected = async (selectedRole: 'farmer' | 'buyer' | 'transporter') => {
    const { error } = await setUserRole(selectedRole);
    if (error) {
      throw error;
    }
    setShowRoleSelection(false);
    
    // Update profile user_type as well for display purposes
    if (user) {
      await supabase
        .from('profiles')
        .update({ user_type: selectedRole })
        .eq('id', user.id);
      fetchProfile();
    }

    toast({
      title: 'Welcome!',
      description: `Your account is set up as a ${selectedRole}`,
    });
  };

  const handleTransporterOnboardingComplete = () => {
    setShowTransporterOnboarding(false);
    setHasTransporterDetails(true);
    toast({
      title: 'Setup Complete',
      description: 'You can now start accepting transport requests!',
    });
  };

  if (authLoading || loading || roleLoading) {
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

  const RoleIcon = role ? roleIcons[role] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Role Selection Dialog */}
      <RoleSelectionDialog
        open={showRoleSelection}
        onRoleSelected={handleRoleSelected}
      />

      {/* Transporter Onboarding Dialog */}
      <TransporterOnboardingDialog
        open={showTransporterOnboarding}
        onComplete={handleTransporterOnboardingComplete}
      />
      
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
                    {role && RoleIcon && (
                      <Badge className={`mt-2 capitalize border ${roleColors[role]}`}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {role}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="md:self-start"
                    onClick={() => setEditDialogOpen(true)}
                  >
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

        {/* Role-specific Dashboard */}
        {role === 'farmer' && <FarmerDashboard />}
        {role === 'buyer' && <BuyerDashboard />}
        {role === 'transporter' && <TransporterDashboard />}
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profile={profile}
        onProfileUpdated={fetchProfile}
      />
    </div>
  );
};

export default Dashboard;
