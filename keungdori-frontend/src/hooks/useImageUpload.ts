import { supabase } from "../supabaseClient";

export const useImageUpload = () => {

    const BUCKET_NAME = 'keungdori-image';

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
            const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

            if (error) {
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('이미지 업로드 실패 ', error);
            return null;
        }
    };

    const deleteImage = async (imageUrl: string): Promise<void> => {
        try {
            //URL 객체를 사용하여 쿼리 파라미터(token)을 없앤 파일 경로 가져옴
            const url = new URL(imageUrl);
            const pathSegments = url.pathname.split('/');
            const fileName = pathSegments.pop(); // 경로의 맨 마지막에 파일 이름이니까 배열에서 pop함
            
            if (!fileName) {
                console.error("이미지 경로 오류");
                return;
            }

            const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);

            if (error) {
                console.error('기존 이미지 삭제 실패 ', error);
            }
        } catch (error) {
            console.error('기존 이미지 삭제 실패 ', error);
        }
    };

    return { uploadImage, deleteImage };
};