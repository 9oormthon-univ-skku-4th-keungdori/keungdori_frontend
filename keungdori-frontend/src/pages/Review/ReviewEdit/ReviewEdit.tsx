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
import { supabase } from '../../../supabaseClient';

interface Review {
    placeId: number; //카카오 장소 id
    reviewId: number; //리뷰 id
    date: string; //리뷰 작성한 날짜
    rating: number; //별점
    memo: string; //메모
    maintag: string; //메인태그
    subtags: string[]; //서브태그
    imageUrl?: string; //이미지경로(supabase)
}

interface Tag {
  text: string;
  bgColor: string;
}

const ReviewEdit: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    //리뷰목록 화면에서 가져와야 하는 항목들(기존 리뷰, 장소 id, 장소 이름, 장소 주소)
    const reviewData = location.state?.reviewData as Review | undefined; //기존 리뷰(없으면 신규 리뷰 작성임)
    const locationName = location.state?.locationName as string | '장소 이름'; //장소 이름
    const locationAddress = location.state?.locationAddress as number; //장소 위치
    const placeId = location.state?.placeId as number; //장소 아이디

    const isEditMode = !!reviewData;

    const [rating, setRating] = useState(reviewData?.rating ?? 0);
    const [memo, setMemo] = useState(reviewData?.memo ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(reviewData?.imageUrl ?? null);
    
    const [mainTag, setMainTag] = useState<Tag | null>(
        reviewData ? { text: reviewData.maintag, bgColor: '#42a5f5' } : null
    );
    const [subTags, setSubTags] = useState<Tag[]>(
        reviewData ? reviewData.subtags.map(tag => ({ text: tag, bgColor: '#FF769F' })) : []
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tagTypeToEdit, setTagTypeToEdit] = useState<'main' | 'sub'>('main');

    // Supabase 이미지 업로드 함수
    const uploadImage = async (file: File) : Promise<string | null> => {
            try {
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
                const { error } = await supabase.storage.from('버킷 이름').upload(fileName, file);
    
                if (error) {
                    throw error;
                }
    
                const { data: { publicUrl } } = supabase.storage.from('버킷 이름').getPublicUrl(fileName);
    
                return publicUrl;
            } catch (error) {
                console.error('이미지 업로드 실패: ', error);
                return null;
            }
        };
    //이미지 변경 함수
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
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
            // 기존 리뷰 수정
            const payload: { [key: string]: any } = {};
            
            if (rating !== reviewData.rating) payload.rating = rating;
            if (memo !== reviewData.memo) payload.memo = memo;
            if (mainTag.text !== reviewData.maintag) payload.mainHashtag = mainTag.text;
            if (imageUrl !== reviewData.imageUrl) payload.imageUrl = imageUrl;
            
            const currentSubTags = subTags.map(t => t.text);
            if (JSON.stringify(currentSubTags) !== JSON.stringify(reviewData.subtags)) {
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
            // 신규 리뷰 등록
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

export default ReviewEdit;