import { supabase } from "../supabaseClient";

export const useImageUpload = () => {
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
            const { data, error } = await supabase.storage.from('your-bucket-name').upload(fileName, file);

            if (error) {
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage.from('your-bucket-name').getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Image upload failed: ', error);
            return null;
        }
    };

    return { uploadImage };
};