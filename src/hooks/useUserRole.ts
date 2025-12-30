import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'farmer' | 'buyer' | 'transporter' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [hasTransporterDetails, setHasTransporterDetails] = useState(false);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        
        // Fetch user role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) throw roleError;

        if (roleData) {
          setRole(roleData.role as UserRole);

          // If transporter, check if they have vehicle details
          if (roleData.role === 'transporter') {
            const { data: transporterData, error: transporterError } = await supabase
              .from('transporters')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (!transporterError && transporterData) {
              setHasTransporterDetails(true);
            }
          }
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const setUserRole = async (newRole: 'farmer' | 'buyer' | 'transporter') => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: newRole });

      if (error) throw error;

      setRole(newRole);
      return { error: null };
    } catch (error) {
      console.error('Error setting user role:', error);
      return { error };
    }
  };

  return { role, loading, hasTransporterDetails, setHasTransporterDetails, setUserRole };
};
