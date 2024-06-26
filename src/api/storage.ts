// supabase
import { supabaseClient } from '$lib/db';

const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabaseClient
  .storage
  .from(bucket)
  .getPublicUrl(path);

  const { publicUrl } = data;
  
  return publicUrl;
}

const uploadFile = async (
  bucket: string,
  path: string,
  file: any
) => {
  const { data, error } = await supabaseClient
  .storage
  .from(bucket)
  .upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/webp',
  })

  if (error) {
    console.log(error);
    return undefined;
  }

  return data;
}

export {
  getPublicUrl,
  uploadFile,
};