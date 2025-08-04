-- Add payment_methods column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_methods TEXT[];

-- Add a comment to document the payment_methods column
COMMENT ON COLUMN user_profiles.payment_methods IS 'Array of payment methods accepted by the user';

-- Update the handle_new_user function to include payment_methods
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, user_type, payment_methods)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'payment_methods' IS NOT NULL 
        THEN ARRAY(SELECT json_array_elements_text((NEW.raw_user_meta_data->>'payment_methods')::json))
        ELSE ARRAY[]::TEXT[]
      END, 
      ARRAY[]::TEXT[]
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
