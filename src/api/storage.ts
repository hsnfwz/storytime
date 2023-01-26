// config
import supabase from 'src/config/supabase';

const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase
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
  const { data, error } = await supabase
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