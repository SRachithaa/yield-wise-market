-- Update handle_new_user function to add input validation and sanitization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sanitized_name TEXT;
BEGIN
  -- Extract and sanitize full_name from user metadata
  sanitized_name := NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), '');
  
  -- Enforce maximum length of 100 characters
  IF sanitized_name IS NOT NULL AND length(sanitized_name) > 100 THEN
    sanitized_name := substring(sanitized_name, 1, 100);
  END IF;
  
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, sanitized_name);
  RETURN NEW;
END;
$$;