-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('farmer', 'buyer', 'transporter');

-- Create user_roles table (secure role storage - separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create transporters table for vehicle details
CREATE TABLE public.transporters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    vehicle_type TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    capacity TEXT NOT NULL,
    service_area TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on transporters
ALTER TABLE public.transporters ENABLE ROW LEVEL SECURITY;

-- RLS policies for transporters
CREATE POLICY "Transporters can view their own details"
ON public.transporters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Transporters can insert their own details"
ON public.transporters FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'transporter'));

CREATE POLICY "Transporters can update their own details"
ON public.transporters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Buyers can view available transporters"
ON public.transporters FOR SELECT
USING (public.has_role(auth.uid(), 'buyer') AND is_available = true);

-- Create transport_requests table
CREATE TABLE public.transport_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES auth.users(id),
    transporter_id UUID REFERENCES auth.users(id),
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on transport_requests
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for transport_requests
CREATE POLICY "Farmers can view their own transport requests"
ON public.transport_requests FOR SELECT
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can create transport requests"
ON public.transport_requests FOR INSERT
WITH CHECK (auth.uid() = farmer_id AND public.has_role(auth.uid(), 'farmer'));

CREATE POLICY "Farmers can update their pending requests"
ON public.transport_requests FOR UPDATE
USING (auth.uid() = farmer_id AND status = 'pending');

CREATE POLICY "Transporters can view pending requests"
ON public.transport_requests FOR SELECT
USING (public.has_role(auth.uid(), 'transporter') AND status = 'pending');

CREATE POLICY "Transporters can view their accepted requests"
ON public.transport_requests FOR SELECT
USING (auth.uid() = transporter_id);

CREATE POLICY "Transporters can accept pending requests"
ON public.transport_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'transporter') AND status = 'pending');

-- Update crops table RLS to allow buyers to see farmer contact info
CREATE POLICY "Buyers can view all available crops with details"
ON public.crops FOR SELECT
USING (public.has_role(auth.uid(), 'buyer') AND status = 'available');

-- Add trigger for transporters updated_at
CREATE TRIGGER update_transporters_updated_at
BEFORE UPDATE ON public.transporters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for transport_requests updated_at
CREATE TRIGGER update_transport_requests_updated_at
BEFORE UPDATE ON public.transport_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();