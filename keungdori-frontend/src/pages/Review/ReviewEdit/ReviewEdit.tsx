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

const deleteTag = async (tagText: string) => {
    const { data } = await api.delete('/hashtags', { data: { hashtag: tagText } });
    return data;
}


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

    const { mutate: removeTag } = useMutation({
            mutationFn: deleteTag,
            onSuccess: (tagTextToDelete) => {
                if (mainTag?.hashtag === tagTextToDelete) {
                    setMainTag(null);
                } else {
                    setSubTags(prev => prev.filter(tag => tag.hashtag !== tagTextToDelete));
                }
            },
            onError: (error) => {
                console.error("태그 삭제 실패:", error); 
                showAlert("태그 삭제에 실패했습니다.");
            }
    })

    //해시태그 input enter입력 시
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const text = inputValue.trim();
            if (!text.startsWith('#') || text.length <= 1) {
                showAlert('#으로 시작하는 한 글자 이상의 태그를 입력해주세요.');
                return;
            }
            if (mainTag?.hashtag === text || subTags.some(t => t.hashtag === text)) {
                showAlert('이미 추가된 태그입니다.');
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
        if (JSON.stringify(currentSubTags) !== JSON.stringify(reviewData.subTags)) {
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
                                    //onBlur={resetInputState} 
                                    placeholder="#태그 입력 후 Enter"
                                    autoFocus
                                />
                            ) : mainTag ? (
                                <Hashtag text={mainTag.hashtag} backgroundColor={mainTag.backgroundColor} onDelete={handleDeleteTag}/>
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('main'); setInputValue('#')}}>
                                    메인 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>
                        
                        <TagSection>
                            {subTags.map((tag) => (
                                <Hashtag key={tag.hashtag} text={tag.hashtag} backgroundColor={tag.backgroundColor} onDelete={handleDeleteTag}/>
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