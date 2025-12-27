import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { z } from 'zod';

import type { Database } from '@/integrations/supabase/types';

// Validation schema for profile data
const profileSchema = z.object({
  full_name: z.string().trim().max(100, 'Name must be less than 100 characters').optional().or(z.literal('')),
  phone: z.string().trim().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone format (10-15 digits)').optional().or(z.literal('')),
  location: z.string().trim().max(200, 'Location must be less than 200 characters').optional().or(z.literal('')),
  user_type: z.enum(['farmer', 'buyer', 'trader']),
  payment_method: z.string().trim().regex(/^[a-zA-Z0-9@._-]*$/, 'Invalid UPI format').max(100, 'Payment method must be less than 100 characters').optional().or(z.literal('')),
});

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  payment_method?: string | null;
};

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onProfileUpdated: () => void;
}

export const ProfileEditDialog = ({ open, onOpenChange, profile, onProfileUpdated }: ProfileEditDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    user_type: profile?.user_type || 'farmer',
    payment_method: profile?.payment_method || '',
  });

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        user_type: profile.user_type || 'farmer',
        payment_method: profile.payment_method || '',
      });
      setErrors({});
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;

    try {
      setUploading(true);

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      });

      onProfileUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const result = profileSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim() || null,
          phone: formData.phone.trim() || null,
          location: formData.location.trim() || null,
          user_type: formData.user_type,
          payment_method: formData.payment_method.trim() || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      onProfileUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and upload an avatar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {formData.full_name?.[0] || user?.email?.[0].toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
              <Label htmlFor="avatar">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('avatar')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Avatar
                    </>
                  )}
                </Button>
              </Label>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              maxLength={100}
            />
            {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number (10-15 digits)"
              maxLength={15}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter your location"
              maxLength={200}
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
          </div>

          {/* User Type */}
          <div className="space-y-2">
            <Label htmlFor="user_type">User Type</Label>
            <Select
              value={formData.user_type}
              onValueChange={(value) => setFormData({ ...formData, user_type: value })}
            >
              <SelectTrigger id="user_type">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="trader">Trader</SelectItem>
              </SelectContent>
            </Select>
            {errors.user_type && <p className="text-sm text-destructive">{errors.user_type}</p>}
          </div>

          {/* Payment Method (UPI ID) */}
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method (UPI ID)</Label>
            <Input
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              placeholder="e.g., yourname@upi"
              maxLength={100}
            />
            {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
