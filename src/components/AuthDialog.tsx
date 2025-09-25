import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'signin' | 'signup';
}

export const AuthDialog = ({ open, onOpenChange, mode }: AuthDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`🔐 ${mode === 'signin' ? 'Sign in' : 'Sign up'} form submitted`);
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        // Better error handling for common auth issues
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          if (mode === 'signin') {
            errorMessage = "Invalid email or password. If you just signed up, please check your email and confirm your account first.";
          }
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        }
        
        console.error(`🔐 ${mode} error:`, error.message);
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const successMessage = mode === 'signin' 
          ? "Successfully signed in!" 
          : "Account created! Please check your email and click the confirmation link to activate your account.";
          
        toast({
          title: "Success",
          description: successMessage,
        });
        
        if (mode === 'signin') {
          onOpenChange(false);
        } else {
          // For signup, show additional instructions
          toast({
            title: "Check Your Email",
            description: "We've sent you a confirmation link. Click it to activate your account, then you can sign in.",
          });
        }
        
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('🔐 Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Sign In to CropTrade' : 'Create Your CropTrade Account'}
          </DialogTitle>
          {mode === 'signin' && (
            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account yet? Click "Get Started" to create one.
            </p>
          )}
          {mode === 'signup' && (
            <p className="text-sm text-muted-foreground mt-2">
              After signing up, check your email for a confirmation link.
            </p>
          )}
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="hero"
          >
            {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </Button>
          
          {mode === 'signin' && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Having trouble signing in? Make sure you've confirmed your email address.
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};