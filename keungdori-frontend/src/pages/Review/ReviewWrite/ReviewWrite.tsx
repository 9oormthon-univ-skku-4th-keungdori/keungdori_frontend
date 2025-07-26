import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { HiddenImageInput, ImageUploader, MemoTextarea, PageContainer, RatingAndTags, TagPlaceholder, TagSection, TopSection, UploadedImage, VectorIcon } from './Styles';
import { Rating } from '@smastrom/react-rating';
import Hashtag from '../../../components/Hashtag';
import Button from '../../../components/Button';
import api from '../../../api/api';
import HashtagModal from '../../../components/hashtagmodal/HashtagModal';
import vector from '../../../assets/vector.png'
//import { supabase } from '../../../supabaseClient';

interface Review {
    id: number;
    reviewId: number;
    date: string;
    rating: number;
    memo: string;
    mainHashtag: string;
    hashtags: string[];
    imageUrl?: string;
}

interface Tag {
  text: string;
  bgColor: string;
}

const ReviewWrite: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const reviewData = location.state?.reviewData as Review | undefined;
    const locationName = location.state?.locationName as string | '장소 이름';
    const placeId = location.state?.placeId as number;

    const isEditMode = !!reviewData;

    // --- 상태 관리 ---
    const [rating, setRating] = useState(reviewData?.rating ?? 0);
    const [memo, setMemo] = useState(reviewData?.memo ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(reviewData?.imageUrl ?? null);
    
    const [mainTag, setMainTag] = useState<Tag | null>(
        reviewData ? { text: reviewData.mainHashtag, bgColor: '#42a5f5' } : null
    );
    const [subTags, setSubTags] = useState<Tag[]>(
        reviewData ? reviewData.hashtags.map(tag => ({ text: tag, bgColor: '#FF769F' })) : []
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tagTypeToEdit, setTagTypeToEdit] = useState<'main' | 'sub'>('main');

    // Supabase 이미지 업로드 함수
    const uploadImage = async (file: File): Promise<string | null> => {
        /*try {
            // 파일 이름 중복 방지를 위해 현재 시간과 랜덤 문자열 조합
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
            // 'reviews'는 Supabase 스토리지 버킷 이름입니다. 실제 버킷 이름으로 변경해주세요.
            const { error } = await supabase.storage.from('reviews').upload(fileName, file);

            if (error) {
                throw error;
            }

            // 업로드된 이미지의 public URL 가져오기
            const { data } = supabase.storage.from('reviews').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (error) {
            console.error('Supabase 이미지 업로드 실패: ', error);
            alert('이미지 업로드에 실패했습니다.');
            return null;
        }*/
       return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /*if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }*/
    };

    const openModal = (type: 'main' | 'sub') => {
        setTagTypeToEdit(type);
        setIsModalOpen(true);
    };

    const handleSaveTag = useCallback((newTag: Tag) => {
        if (tagTypeToEdit === 'main') {
            setMainTag(newTag);
        } else {
            if (!subTags.some(tag => tag.text === newTag.text)) {
                setSubTags(prev => [...prev, newTag]);
            }
        }
        setIsModalOpen(false);
    }, [tagTypeToEdit, subTags]);
    
    const handleSubmit = async () => {
        if (!rating || !mainTag) {
            alert('별점과 메인 태그는 필수입니다.');
            return;
        }

        let imageUrl = reviewData?.imageUrl ?? null;

        // 새 이미지 파일이 있으면 Supabase에 업로드
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                // 업로드 실패 시 전송 중단
                return;
            }
            imageUrl = uploadedUrl;
        }

        if (isEditMode && reviewData) {
            // --- 수정 모드 (PATCH) ---
            const payload: { [key: string]: any } = {};
            
            if (rating !== reviewData.rating) payload.rating = rating;
            if (memo !== reviewData.memo) payload.memo = memo;
            if (mainTag.text !== reviewData.mainHashtag) payload.mainHashtag = mainTag.text;
            if (imageUrl !== reviewData.imageUrl) payload.imageUrl = imageUrl;
            
            const currentSubTags = subTags.map(t => t.text);
            if (JSON.stringify(currentSubTags) !== JSON.stringify(reviewData.hashtags)) {
                payload.hashtags = currentSubTags;
            }

            if (Object.keys(payload).length === 0) {
                alert('수정된 내용이 없습니다.');
                return;
            }

            try {
                await api.patch(`/reviews/${reviewData.reviewId}`, payload);
                alert('리뷰가 수정되었습니다.');
                navigate(-1);
            } catch (error) {
                console.error('리뷰 수정 실패:', error);
                alert('리뷰 수정에 실패했습니다.');
            }

        } else {
            // --- 등록 모드 (POST) ---
            const payload = {
                placeId,
                rating,
                memo,
                mainHashtag: mainTag.text,
                hashtags: subTags.map(t => t.text),
                imageUrl,
            };

            try {
                await api.post('/reviews', payload);
                alert('리뷰가 등록되었습니다.');
                navigate(-1);
            } catch (error) {
                console.error('리뷰 등록 실패:', error);
                alert('리뷰 등록에 실패했습니다.');
            }
        }
    };

    return (
        <>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                centerNode={<h2>{locationName}</h2>}
                onLeftClick={() => navigate(-1)}
            />
            <PageContainer>
                <TopSection>
                    <RatingAndTags>
                        <Rating style={{ maxWidth: 200 }} value={rating} onChange={setRating} />
                        <TagSection onClick={() => openModal('main')}>
                            {mainTag ? (
                                <Hashtag bgColor={mainTag.bgColor}>{mainTag.text}</Hashtag>
                            ) : (
                                <TagPlaceholder>메인 태그를 추가해주세요.</TagPlaceholder>
                            )}
                        </TagSection>
                        <TagSection onClick={() => openModal('sub')}>
                            {subTags.length > 0 ? (
                                subTags.map((tag) => (
                                    <Hashtag key={tag.text} bgColor={tag.bgColor}>
                                        {tag.text}
                                    </Hashtag>
                                ))
                            ) : (
                                <TagPlaceholder>서브 태그를 추가해주세요.</TagPlaceholder>
                            )}
                        </TagSection>
                    </RatingAndTags>
                    <ImageUploader>
                        <HiddenImageInput type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && <UploadedImage src={imagePreview} alt="리뷰 사진" />}
                    </ImageUploader>
                </TopSection>

                <MemoTextarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="이 장소에 대한 솔직한 리뷰를 남겨주세요."
                />

                <Button onClick={handleSubmit} disabled={!rating || !mainTag}>
                    {isEditMode ? '수정하기' : '등록하기'}
                </Button>
            </PageContainer>
            
            <HashtagModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTag}
            />
        </>
    );
};

export default ReviewWrite;