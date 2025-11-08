import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import { HiddenImageInput, ImageUploader, MemoTextarea, PageContainer, PlaceName, RatingAndTags, TagInput, TagPlaceholder, TagSection, TopSection, UploadedImage, VectorIcon } from './Styles';
import { Rating } from '@smastrom/react-rating';
import Hashtag from '../../../components/Hashtag';
import Button from '../../../components/Button';
import api from '../../../api/api';
import AlertModal from '../../../components/alertmodal/AlertModal';
import HashtagModal from '../../../components/hashtagmodal/HashtagModal';
import vector from '../../../assets/vector.png';
import profile_image from '../../../assets/profile_image.png';
import { useImageInput } from '../../../hooks/useImageInput';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Review {
    reviewId: number;
    rating: number;
    memo: string;
    mainTag: Tag; // string -> Tag
    subTags: Tag[]; // string[] -> Tag[]
    placeName: string; 
    address: string;
    googleId: string;
    xCoordinate: number;
    yCoordinate: number;
    date: string;
    imageUrl: string;
}

const getReviewById = async (reviewId: number) => {
    const { data } = await api.get(`/reviews/${reviewId}`);
    return data;
};

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

// [추가] 메인 태그 삭제 API
const removeMainTag = async (placeId: string) => {
    // 요청하신 엔드포인트: api/reviews/places/{placeId}/maintag
    const { data } = await api.delete(`/reviews/places/${placeId}/maintag`);
    return data;
};

// [추가] 서브 태그 삭제 API
const removeSubTag = async ({ reviewId, tagText }: { reviewId: number, tagText: string }) => {
    // 요청하신 엔드포인트: api/reviews/{reviewId}/subtag?태그이름
    // 'tag' 쿼리 파라미터로 태그 이름을 전송합니다.
    const { data } = await api.delete(`/reviews/${reviewId}/subtag`, {
        params: { tag: tagText } 
    });
    return data;
};


const ReviewEdit: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { reviewId } = useParams<{ reviewId: string }>();

    //리뷰 get
    const { data: reviewData } = useQuery<Review>({
        queryKey: ['review', reviewId],
        queryFn: () => getReviewById(Number(reviewId!)),
        initialData: location.state?.reviewData, // location.state 데이터를 초기값으로 사용
        enabled: !!reviewId, // reviewId가 있을 때만 쿼리 실행
    });

    useEffect(() => {
        if (reviewData) {
            setRating(reviewData.rating);
            setMemo(reviewData.memo);
            setMainTag(reviewData.mainTag);
            setSubTags(reviewData.subTags || []);
        }
    }, [reviewData]);

    //리뷰목록 화면에서 가져와야 하는 항목들(기존 리뷰, 장소 id, 장소 이름, 장소 주소)
    const [rating, setRating] = useState(0);
    const [memo, setMemo] = useState('');
    const [mainTag, setMainTag] = useState<Tag | null>(null);
    const [subTags, setSubTags] = useState<Tag[]>([]);
    const initialImageUrl = reviewData?.imageUrl || profile_image;

    const {
            previewUrl,
            imageFile,
            //error: imageError, // 필요하다면 에러 처리 추가
            handleImageChange, //label안에 input 있어서 handleimagechange만 줘도 이미지 누르면 파일 탐색기가 뜸
        } = useImageInput(initialImageUrl); // 1. 초기 이미지 뭘로 할지?
    const { uploadImage, deleteImage } = useImageUpload();

    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [activeInput, setActiveInput] = useState<'main' | 'sub' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [tagToColorize, setTagToColorize] = useState<string | null>(null);

    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        text: '',
        buttonText: '확인',
        onConfirm: () => {}
    });

    const showAlert = (text: string, onConfirmAction?: () => void) => {
        setAlertModal({
            isOpen: true,
            text,
            buttonText: '확인',
            onConfirm: () => {
                setAlertModal({ isOpen: false, text: '', buttonText: '확인', onConfirm: () => {} });
                if (onConfirmAction) {
                    onConfirmAction();
                }
            }
        });
    };

    const resetInputState = () => {
        setActiveInput(null);
        setInputValue('');
    };

    //리뷰 patch
    const { mutate: editReview, /*isPending: isEditing*/ } = useMutation({
        mutationFn: updateReview,
        onSuccess: (/*data,*/ variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', reviewData.googleId] });

            //이미지 교체가 일어났을 경우에만 기존 이미지 삭제
            if (variables.payload.imageUrl && reviewData.imageUrl) {
                deleteImage(reviewData.imageUrl); 
            }
            
            showAlert('리뷰가 성공적으로 수정되었습니다.', () => {
                navigate(-1);
            });
        },
        onError: (error) => {
            console.error('리뷰 수정 실패:', error);
            showAlert('리뷰 수정에 실패했습니다.');
        }
    });

    //해시태그 post
    const { mutate: addTag } = useMutation({
        mutationFn: createTag,
        onSuccess: (newTag) => {
            if (newTag.color) {
                const tagForState = { hashtag: newTag.hashtag, backgroundColor: newTag.backgroundColor, fontColor: newTag.fontColor };
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
            showAlert('태그를 생성하는 데 실패했습니다.');
            resetInputState();
        }
    });

    //해시태그 patch
    const { mutate: patchColor } = useMutation({
        mutationFn: updateTagColor,
        onSuccess: (updatedTag) => {
            const tagForState = { hashtag: updatedTag.hashtag, backgroundColor: updatedTag.backgroundColor, fontColor: updatedTag.fontColor };
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
            showAlert('태그 색상을 업데이트하는 데 실패했습니다.');
            setIsColorModalOpen(false);
        }
    });

    // [추가] 메인 태그 삭제 뮤테이션
    const { mutate: removeMainTagMutation } = useMutation({
        mutationFn: removeMainTag,
        onSuccess: () => {
            setMainTag(null); // 상태 업데이트
            // 리뷰 데이터를 다시 불러와 캐시를 갱신합니다.
            queryClient.invalidateQueries({ queryKey: ['review', reviewId] }); 
        },
        onError: (error) => {
            console.error("메인 태그 삭제 실패:", error);
            showAlert("메인 태그 삭제에 실패했습니다.");
        }
    });

    // [추가] 서브 태그 삭제 뮤테이션
    const { mutate: removeSubTagMutation } = useMutation({
        mutationFn: removeSubTag,
        onSuccess: (_, variables) => { // variables: { reviewId, tagText }
            // 상태 업데이트
            setSubTags(prev => prev.filter(tag => tag.hashtag !== variables.tagText)); 
            // 리뷰 데이터를 다시 불러와 캐시를 갱신합니다.
            queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
        },
        onError: (error) => {
            console.error("서브 태그 삭제 실패:", error);
            showAlert("서브 태그 삭제에 실패했습니다.");
        }
    });

    // [추가] 1. 태그 제출 로직을 별도 함수로 분리합니다.
    const handleTagSubmit = () => {
        const text = inputValue.trim();

        // 입력값이 없거나 '#'만 있으면, 경고 없이 그냥 입력창을 닫습니다.
        if (text.length <= 1 || text === '#') {
            resetInputState();
            return;
        }

        // --- 유효성 검사 ---
        if (!text.startsWith('#')) {
            showAlert('#으로 시작하는 한 글자 이상의 태그를 입력해주세요.');
            resetInputState(); // [수정] 잘못된 입력 시에도 입력창 초기화
            return;
        }
        // [수정] ReviewEdit.tsx에 맞게 mainTag.text -> mainTag.hashtag로 변경
        if (mainTag?.hashtag === text || subTags.some(t => t.hashtag === text)) {
            showAlert('이미 추가된 태그입니다.');
            resetInputState(); // [수정] 중복 시에도 입력창 초기화
            return;
        }

        // 모든 검증 통과 시 태그 생성 API 호출
        addTag(text);
    };

    // [수정] 2. onKeyDown 핸들러를 수정합니다.
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // 분리된 태그 제출 함수를 호출합니다.
            handleTagSubmit();
        }
    };

    // [추가] 3. onBlur 핸들러를 새로 만듭니다.
    const handleInputBlur = () => {
        // onKeyDown과 동일하게, 분리된 태그 제출 함수를 호출합니다.
        handleTagSubmit();
    };

    //모달에서 색상 선택시 patch api 호출
    const handleColorSelect = (backgroundColor: string) => {
        if (tagToColorize) {
            patchColor({ text: tagToColorize, backgroundColor });
        }
    };

    // [수정]
    const handleDeleteTag = (textToDelete: string) => {
        // 삭제하려는 태그가 메인 태그인 경우
        if (mainTag?.hashtag === textToDelete) {
            // reviewData.googleId가 장소 ID(placeId)라고 가정합니다.
            if (reviewData?.googleId) {
                removeMainTagMutation(reviewData.googleId);
            } else {
                console.error("Place ID (googleId)를 찾을 수 없습니다.");
                showAlert("메인 태그 삭제에 실패했습니다: 장소 ID 없음");
            }
        } 
        // 삭제하려는 태그가 서브 태그인 경우
        else if (subTags.some(tag => tag.hashtag === textToDelete)) {
            removeSubTagMutation({ reviewId: Number(reviewId!), tagText: textToDelete });
        }
    };
    
    //리뷰 수정 제출
    const handleSubmit = async () => {
        if (!rating || !mainTag) {
            showAlert('별점과 메인 태그는 필수입니다.');
            return;
        }

        let newImageUrl: string | null = null;

        // 새 이미지 파일이 있으면 Supabase에 업로드
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                showAlert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                return;
            }
            newImageUrl = uploadedUrl;
        }

        //변경된 데이터
        const payload: { [key: string]: any } = {};
        if (rating !== reviewData.rating) payload.rating = rating;
        if (memo !== reviewData.memo) payload.memo = memo;
        if (mainTag.hashtag !== reviewData.mainTag.hashtag) payload.mainHashtag = mainTag.hashtag;
        if (newImageUrl && newImageUrl !== reviewData.imageUrl) {
            payload.imageUrl = newImageUrl;
        }    
        const currentSubTags = subTags.map(t => t.hashtag);
        if (JSON.stringify(currentSubTags) !== JSON.stringify(reviewData.subTags.map(t => t.hashtag))) {
            payload.hashtags = currentSubTags;
        }

        if (Object.keys(payload).length === 0) {
            showAlert('수정된 내용이 없습니다.');
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
                                    onBlur={handleInputBlur} 
                                    placeholder="#태그 입력 후 Enter"
                                    autoFocus
                                />
                            ) : mainTag ? (
                                <Hashtag text={mainTag.hashtag} backgroundColor={mainTag.backgroundColor} fontColor={mainTag.fontColor} onDelete={handleDeleteTag}/>
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('main'); setInputValue('#')}}>
                                    메인 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>
                        
                        <TagSection>
                            {subTags.map((tag) => (
                                <Hashtag key={tag.hashtag} text={tag.hashtag} backgroundColor={tag.backgroundColor} fontColor={tag.fontColor} onDelete={handleDeleteTag}/>
                            ))}
                            {activeInput === 'sub' ? (
                                 <TagInput 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    onBlur={handleInputBlur}
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
                  resetInputState(); // 모달을 닫으면 입력 상태 초기화
                }}
                onColorSelect={handleColorSelect}
            />

            <AlertModal
                isOpen={alertModal.isOpen}
                onConfirm={alertModal.onConfirm}
                text={alertModal.text}
                buttonText={alertModal.buttonText}
            />

        </>
    );
};

export default ReviewEdit;