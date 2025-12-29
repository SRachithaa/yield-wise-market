import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Tractor, ShoppingCart, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoleSelectionDialogProps {
  open: boolean;
  onRoleSelected: (role: 'farmer' | 'buyer' | 'transporter') => Promise<void>;
}

const roles = [
  {
    id: 'farmer' as const,
    title: 'Farmer',
    description: 'List and sell your crops directly to buyers',
    icon: Tractor,
    color: 'text-success',
    bgColor: 'bg-success/10 hover:bg-success/20',
    borderColor: 'border-success/30',
  },
  {
    id: 'buyer' as const,
    title: 'Buyer',
    description: 'Browse and purchase crops from farmers',
    icon: ShoppingCart,
    color: 'text-primary',
    bgColor: 'bg-primary/10 hover:bg-primary/20',
    borderColor: 'border-primary/30',
  },
  {
    id: 'transporter' as const,
    title: 'Transporter',
    description: 'Provide transport services for crop deliveries',
    icon: Truck,
    color: 'text-accent',
    bgColor: 'bg-accent/10 hover:bg-accent/20',
    borderColor: 'border-accent/30',
  },
];

export const RoleSelectionDialog = ({ open, onRoleSelected }: RoleSelectionDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | 'transporter' | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!selectedRole) {
      toast({
        title: 'Please select a role',
        description: 'You must choose a role to continue',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onRoleSelected(selectedRole);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set role. Please try again.',
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
          <DialogTitle className="text-2xl">Welcome to CropTrade!</DialogTitle>
          <DialogDescription>
            Select your role to get started. This will customize your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 ${role.bgColor} ${role.borderColor} border-2 ${
                selectedRole === role.id ? `ring-2 ring-offset-2 ring-${role.id === 'farmer' ? 'success' : role.id === 'buyer' ? 'primary' : 'accent'}` : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-3 rounded-full ${role.bgColor}`}>
                  <role.icon className={`h-6 w-6 ${role.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                {selectedRole === role.id && (
                  <div className={`w-4 h-4 rounded-full bg-current ${role.color}`} />
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selectedRole || loading}
          className="w-full"
          variant="hero"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up your account...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
