import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { ArrowLeft, Loader2, Tractor, ShoppingCart, Truck } from 'lucide-react';

// Email validation schema
const emailSchema = z.string().trim().email('Please enter a valid email address');

type UserRole = 'farmer' | 'buyer' | 'transporter';

const roleOptions: { id: UserRole; label: string; description: string; icon: typeof Tractor }[] = [
  { id: 'farmer', label: 'Farmer', description: 'Sell your crops', icon: Tractor },
  { id: 'buyer', label: 'Buyer', description: 'Buy fresh produce', icon: ShoppingCart },
  { id: 'transporter', label: 'Transporter', description: 'Provide logistics', icon: Truck },
];

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'signin' | 'signup';
}

export const AuthDialog = ({ open, onOpenChange, mode: initialMode }: AuthDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'auth' | 'forgot-password'>('auth');
  const [emailError, setEmailError] = useState('');
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setSelectedRole('');
    setEmailError('');
    setCurrentView('auth');
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const validateEmail = (emailValue: string): boolean => {
    const result = emailSchema.safeParse(emailValue);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check Your Email",
          description: "If this email is registered, a password reset link has been sent.",
        });
        setCurrentView('auth');
        setEmail('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate role selection for signup
    if (initialMode === 'signup' && !selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (initialMode === 'signin') {
        const { error } = await signIn(email, password);

        if (error) {
          let errorMessage = error.message;
          
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = "Please confirm your email before signing in. Check your inbox for the confirmation link.";
          }
          
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in.",
          });
          handleClose(false);
          navigate('/dashboard');
        }
      } else {
        // Signup flow
        const { error, data } = await signUp(email, password);

        if (error) {
          let errorMessage = error.message;
          
          if (error.message.includes('User already registered')) {
            errorMessage = "An account with this email already exists. Try signing in instead.";
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = "Password must be at least 6 characters long.";
          }
          
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else if (data?.user) {
          // Save the user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: data.user.id, role: selectedRole as UserRole });

          if (roleError) {
            console.error('Error saving role:', roleError);
          }

          // Update profile with user_type
          await supabase
            .from('profiles')
            .update({ user_type: selectedRole })
            .eq('id', data.user.id);

          toast({
            title: "Account Created!",
            description: `Welcome to CropTrade! Your ${selectedRole} account is ready.`,
          });
          
          handleClose(false);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password View
  if (currentView === 'forgot-password') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="Enter your registered email"
                disabled={loading}
                className={emailError ? 'border-destructive' : ''}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              variant="hero"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setCurrentView('auth');
                setEmailError('');
              }}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Sign In / Sign Up View
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialMode === 'signin' ? 'Sign In to CropTrade' : 'Create Your CropTrade Account'}
          </DialogTitle>
          <DialogDescription>
            {initialMode === 'signin' 
              ? "Enter your credentials to access your account."
              : "Choose your role and create your account to get started."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {initialMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('forgot-password')}
                  className="text-sm text-primary hover:underline focus:outline-none focus:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={initialMode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {/* Role Selection for Signup */}
          {initialMode === 'signup' && (
            <div className="space-y-3">
              <Label>Select Your Role <span className="text-destructive">*</span></Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                className="grid gap-2"
              >
                {roleOptions.map((role) => (
                  <div key={role.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={role.id} id={role.id} />
                    <Label
                      htmlFor={role.id}
                      className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        role.id === 'farmer' ? 'bg-success/10 text-success' :
                        role.id === 'buyer' ? 'bg-primary/10 text-primary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        <role.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="hero"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {initialMode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              initialMode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  );
};
