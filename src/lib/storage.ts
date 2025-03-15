import { supabase } from './supabase';

export async function uploadPDF(file: File, userId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = `pdfs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function downloadPDF(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from('materials')
      .download(path);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export async function deletePDF(path: string) {
  try {
    const { error } = await supabase.storage
      .from('materials')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}