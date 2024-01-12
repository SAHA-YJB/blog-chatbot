import { Database } from './supabase';

export type PostRequest = Database['public']['Tables']['Post']['Insert'];
export type Post = Omit<Database['public']['Tables']['Post']['Row'], 'tags'> & {
  tags: string[];
};
