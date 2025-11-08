import { useState, useRef, useEffect } from "react";

interface UseImageInputReturn {
    previewUrl: string | null;
    imageFile: File | null;
    error: string | null; 
    imageFileRef: React.RefObject<HTMLInputElement>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    triggerFileInput: () => void;
}

export const useImageInput = (initialImageUrl: string): UseImageInputReturn => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null); 
    const imageFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreviewUrl(initialImageUrl);
    }, [initialImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null); //새로운 파일 선택 시 에러 초기화
        const file = e.target.files?.[0];

        //input 값을 초기화하여 동일한 파일 재선택 시에도 onChange가 동작하게 함
        if (imageFileRef.current) {
            imageFileRef.current.value = '';
        }

        if (!file) return;

        const fileTypes = ["image/jpeg", "image/png"];
        if (!fileTypes.includes(file.type)) {
            setError("jpeg, png 형식의 이미지만 가능합니다.");
            setImageFile(null); //잘못된 파일이니까 파일 상태 초기화
            setPreviewUrl(initialImageUrl); //미리보기도 초기 이미지로 되돌림
            return;
        }

        setImageFile(file);

        const reader = new FileReader(); //브라우저에서 파일 읽는 객체
        reader.readAsDataURL(file); //이미지 파일을 base64로 인코딩해서 문자열로 만듦(비동기)
        reader.onloadend = () => { //문자열만으로 이미지 볼 수 있음
            setPreviewUrl(reader.result as string);
        };
    };

    const triggerFileInput = () => { //이미지 파일에 접근하기 위한 ref
        imageFileRef.current?.click();
    };

    return { previewUrl, imageFile, error, imageFileRef, handleImageChange, triggerFileInput };
};