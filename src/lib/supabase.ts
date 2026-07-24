import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://cxnsawbfupenjdgmfjjn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'daily-photos';

/**
 * Uploads a proof photo to Supabase Storage bucket 'daily-photos'
 * @param file - File or Blob object
 * @param filename - Custom filename
 * @returns Public URL of the uploaded image
 */
export async function uploadProofPhoto(file: File, filename: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `proofs/${Date.now()}_${filename.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Error uploading photo:', err);
    throw err;
  }
}
