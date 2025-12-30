import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const vehicleSchema = z.object({
  vehicle_type: z.string().min(1, 'Please select a vehicle type'),
  vehicle_number: z.string().min(1, 'Vehicle number is required').max(20, 'Vehicle number too long'),
  capacity: z.string().min(1, 'Please select capacity'),
  service_area: z.string().min(1, 'Service area is required').max(100, 'Service area too long'),
});

interface TransporterOnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

const vehicleTypes = ['Truck', 'Van', 'Pickup', 'Mini Truck', 'Tractor Trolley'];
const capacities = ['Up to 500 kg', '500 kg - 1 ton', '1 - 3 tons', '3 - 5 tons', '5+ tons'];

export const TransporterOnboardingDialog = ({ open, onComplete }: TransporterOnboardingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    vehicle_type: '',
    vehicle_number: '',
    capacity: '',
    service_area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate form
    const result = vehicleSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase
        .from('transporters')
        .insert({
          user_id: user.id,
          vehicle_type: formData.vehicle_type,
          vehicle_number: formData.vehicle_number.toUpperCase(),
          capacity: formData.capacity,
          service_area: formData.service_area,
        });

      if (error) throw error;

      toast({
        title: 'Vehicle Registered',
        description: 'Your vehicle details have been saved successfully!',
      });

      onComplete();
    } catch (error: any) {
      console.error('Error saving transporter details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save vehicle details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-accent/10">
              <Truck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-xl">Register Your Vehicle</DialogTitle>
              <DialogDescription>
                Add your vehicle details to start accepting transport requests
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle_type">Vehicle Type *</Label>
            <Select
              value={formData.vehicle_type}
              onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
            >
              <SelectTrigger id="vehicle_type">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_type && <p className="text-sm text-destructive">{errors.vehicle_type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle_number">Vehicle Number *</Label>
            <Input
              id="vehicle_number"
              value={formData.vehicle_number}
              onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
              placeholder="e.g., MH 12 AB 1234"
              disabled={loading}
            />
            {errors.vehicle_number && <p className="text-sm text-destructive">{errors.vehicle_number}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Select
              value={formData.capacity}
              onValueChange={(value) => setFormData({ ...formData, capacity: value })}
            >
              <SelectTrigger id="capacity">
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                {capacities.map((cap) => (
                  <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_area">Service Area *</Label>
            <Input
              id="service_area"
              value={formData.service_area}
              onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
              placeholder="e.g., Mumbai, Pune, Nashik"
              disabled={loading}
            />
            {errors.service_area && <p className="text-sm text-destructive">{errors.service_area}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full" variant="hero">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
