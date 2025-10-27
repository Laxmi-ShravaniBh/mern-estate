import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Regular client for auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for storage operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export const uploadFile = async (file, bucket, folder = '') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path]);
  if (error) throw error;
};