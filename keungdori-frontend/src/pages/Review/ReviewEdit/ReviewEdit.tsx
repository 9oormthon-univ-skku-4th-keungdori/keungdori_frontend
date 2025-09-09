import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { HiddenImageInput, ImageUploader, MemoTextarea, PageContainer, PlaceName, RatingAndTags, TagInput, TagPlaceholder, TagSection, TopSection, UploadedImage, VectorIcon } from './Styles';
import { Rating } from '@smastrom/react-rating';
import Hashtag from '../../../components/Hashtag';
import Button from '../../../components/Button';
import api from '../../../api/api';
import HashtagModal from '../../../components/hashtagmodal/HashtagModal';
import vector from '../../../assets/vector.png';
import profile_image from '../../../assets/profile_image.png';
import { useImageInput } from '../../../hooks/useImageInput';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Review {
    placeId: number; //카카오 장소 id
    placeName: string; //카카오 장소 id
    x: number; //장소 위도
    y: number; //장소 경도
    reviewId: number; //리뷰 id
    date: string; //리뷰 작성한 날짜
    rating: number; //별점
    maintag: string; //메인태그
    subtags: string[]; //서브태그
    imageUrl?: string; //이미지경로(supabase)
    memo: string; //메모
}

interface Tag {//리뷰를 가져오고 해시태그를 표시하려면 해시태그 색상이 필요한데, 해시태그 get api가 필요함
  text: string;
  backgroundColor: string;
}

const updateReview = async ({ reviewId, payload }: { reviewId: number, payload: any }) => {
    const { data } = await api.patch(`/reviews/${reviewId}`, payload);
    return data;
};

const createTag = async (tagText: string) => {
    const { data } = await api.post('/hashtags', { hashtag: tagText });
    return data;
};

const updateTagColor = async (variables: { text: string; backgroundColor: string }) => {
    const { data } = await api.patch('/hashtags', { hashtag: variables.text, backgroundColor: variables.backgroundColor });
    return data;
};

const deleteTag = async (tagText: string) => {
    const { data } = await api.delete('/hashtags', { data: { hashtag: tagText } });
    return data;
}


const ReviewEdit: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    //리뷰목록 화면에서 가져와야 하는 항목들(기존 리뷰, 장소 id, 장소 이름, 장소 주소)
    const reviewData = location.state.reviewData as Review; //기존 리뷰
    const [rating, setRating] = useState(reviewData.rating);
    const [memo, setMemo] = useState(reviewData.memo);
    const [mainTag, setMainTag] = useState<Tag | null>(
        { text: reviewData.maintag, backgroundColor: '#42a5f5' }//!!해시태그 api로 가져와야 함
    );
    const [subTags, setSubTags] = useState<Tag[]>(//!!해시태그 api로 가져와야 함
        reviewData.subtags ? reviewData.subtags.map(tag => ({ text: tag, backgroundColor: '#FF769F' })) : []
    );
    const review_image = reviewData.imageUrl || profile_image;
    const {
            previewUrl,
            imageFile,
            //error: imageError, // 필요하다면 에러 처리 추가
            handleImageChange, //label안에 input 있어서 handleimagechange만 줘도 이미지 누르면 파일 탐색기가 뜸
        } = useImageInput(review_image); // 1. 초기 이미지 뭘로 할지?
    const { uploadImage, deleteImage } = useImageUpload();

    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [activeInput, setActiveInput] = useState<'main' | 'sub' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [tagToColorize, setTagToColorize] = useState<string | null>(null);

    const resetInputState = () => {
        setActiveInput(null);
        setInputValue('');
    };

    //리뷰 patch
    const { mutate: editReview, /*isPending: isEditing*/ } = useMutation({
        mutationFn: updateReview,
        onSuccess: (/*data,*/ variables) => {
            //alert('리뷰가 성공적으로 수정되었습니다.'); 2. 모달로 변경
            queryClient.invalidateQueries({ queryKey: ['reviews', reviewData.placeId] });

            //이미지 교체가 일어났을 경우에만 기존 이미지 삭제
            if (variables.payload.imageUrl && reviewData.imageUrl) {
                deleteImage(reviewData.imageUrl); 
            }
            
            navigate(-1);
        },
        onError: (error) => {
            console.error('리뷰 수정 실패:', error);
            //alert('리뷰 수정에 실패했습니다.'); 2. 모달로 변경
        }
    });

    //해시태그 post
    const { mutate: addTag } = useMutation({
        mutationFn: createTag,
        onSuccess: (newTag) => {
            if (newTag.color) {
                const tagForState = { text: newTag.hashtag, backgroundColor: newTag.color };
                if (activeInput === 'main') {
                    setMainTag(tagForState);
                } else {
                    setSubTags(prev => [...prev, tagForState]);
                }
                resetInputState();
            } else {
                setTagToColorize(newTag.hashtag);
                setIsColorModalOpen(true);
            }
        },
        onError: (error) => {
            console.error('태그 생성 실패:', error);
            //alert('태그를 생성하는 데 실패했습니다.'); 2. 모달로 변경
            resetInputState();
        }
    });

    //해시태그 patch
    const { mutate: patchColor } = useMutation({
        mutationFn: updateTagColor,
        onSuccess: (updatedTag) => {
            const tagForState = { text: updatedTag.hashtag, backgroundColor: updatedTag.backgroundColor };
            if (activeInput === 'main') {
                setMainTag(tagForState);
            } else {
                setSubTags(prev => [...prev, tagForState]);
            }
            resetInputState();
            setIsColorModalOpen(false);
            setTagToColorize(null);
        },
        onError: (error) => {
            console.error('태그 색상 업데이트 실패:', error);
            //alert('태그 색상을 업데이트하는 데 실패했습니다.'); 2. 모달로 변경
            setIsColorModalOpen(false);
        }
    });

    const { mutate: removeTag } = useMutation({
            mutationFn: deleteTag,
            onSuccess: (tagTextToDelete) => {
                if (mainTag?.text === tagTextToDelete) {
                    setMainTag(null);
                } else {
                    setSubTags(prev => prev.filter(tag => tag.text !== tagTextToDelete));
                }
            },
            onError: (error) => {
                console.error("태그 삭제 실패:", error); 
                alert("태그 삭제 실패");
            }
    })

    //해시태그 input enter입력 시
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const text = inputValue.trim();
            if (!text.startsWith('#') || text.length <= 1) {
                alert('#으로 시작하는 한 글자 이상의 태그를 입력해주세요.');
                return;
            }
            if (mainTag?.text === text || subTags.some(t => t.text === text)) {
                alert('이미 추가된 태그입니다.');
                return;
            }
            addTag(text);
        }
    };

    //모달에서 색상 선택시 patch api 호출
    const handleColorSelect = (backgroundColor: string) => {
        if (tagToColorize) {
            patchColor({ text: tagToColorize, backgroundColor });
        }
    };

    const handleDeleteTag = (textToDelete: string) => {
        removeTag(textToDelete);
    };
    
    //리뷰 수정 제출
    const handleSubmit = async () => {
        if (!rating || !mainTag) {
            alert('별점과 메인 태그는 필수입니다.'); //2. 모달로 변경
            return;
        }

        let newImageUrl: string | null = null;

        // 새 이미지 파일이 있으면 Supabase에 업로드
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                // 업로드 실패 시 전송 중단
                return;
            }
            newImageUrl = uploadedUrl;
        }

        //변경된 데이터
        const payload: { [key: string]: any } = {};
        if (rating !== reviewData.rating) payload.rating = rating;
        if (memo !== reviewData.memo) payload.memo = memo;
        if (mainTag.text !== reviewData.maintag) payload.mainHashtag = mainTag.text;
        if (newImageUrl && newImageUrl !== reviewData.imageUrl) {
            payload.imageUrl = newImageUrl;
        }    
        const currentSubTags = subTags.map(t => t.text);
        if (JSON.stringify(currentSubTags) !== JSON.stringify(reviewData.subtags)) {
            payload.hashtags = currentSubTags;
        }

        if (Object.keys(payload).length === 0) {
            alert('수정된 내용이 없습니다.'); // 2. 모달로 변경
            return;
        }

        editReview({ reviewId: reviewData.reviewId, payload });
    };

    return (
        <>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={() => navigate(-1)}
            />

            <PlaceName>
                {reviewData.placeName}
            </PlaceName>

            <PageContainer>
                <TopSection>
                    <RatingAndTags>

                        <Rating style={{ maxWidth: 200 }} value={rating} onChange={setRating} />
                        
                        <TagSection>
                            {activeInput === 'main' ? (
                                <TagInput 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    onBlur={resetInputState} 
                                    placeholder="#태그 입력 후 Enter"
                                    autoFocus
                                />
                            ) : mainTag ? (
                                <Hashtag text={mainTag.text} bgColor={mainTag.backgroundColor} onDelete={handleDeleteTag}/>
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('main'); setInputValue('#')}}>
                                    메인 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>
                        
                        <TagSection>
                            {subTags.map((tag) => (
                                <Hashtag key={tag.text} text={tag.text} bgColor={tag.backgroundColor} onDelete={handleDeleteTag}/>
                            ))}
                            {activeInput === 'sub' ? (
                                 <TagInput 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    onBlur={resetInputState}
                                    placeholder="#태그 입력 후 Enter"
                                    autoFocus
                                 />
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('sub'); setInputValue('#')}}>
                                    서브 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>

                    </RatingAndTags>

                    <ImageUploader>
                        <HiddenImageInput type="file" accept="image/*" onChange={handleImageChange} />
                        {previewUrl && <UploadedImage src={previewUrl} alt="리뷰 사진" />}
                    </ImageUploader>
                </TopSection>

                <MemoTextarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="장소에 대한 리뷰를 남겨주세요."
                />

                <Button onClick={handleSubmit} disabled={!rating || !mainTag || !memo}>
                    수정하기
                </Button>
            </PageContainer>
            
            <HashtagModal
                isOpen={isColorModalOpen}
                onClose={() => {
                  setIsColorModalOpen(false);
                  resetInputState(); // 모달을 그냥 닫으면 입력 상태 초기화
                }}
                onColorSelect={handleColorSelect}
            />
        </>
    );
};

export default ReviewEdit;