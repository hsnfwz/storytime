// config
import supabase from '$config/supabase';

const getPublicUrl = (path: string) => {
  const { data } = supabase
  .storage
  .from('library')
  .getPublicUrl(path);

  const { publicUrl } = data;
  
  return publicUrl;
}

const uploadFile = async (
  path: string,
  file: any
) => {
  const { data, error } = await supabase
  .storage
  .from('library')
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