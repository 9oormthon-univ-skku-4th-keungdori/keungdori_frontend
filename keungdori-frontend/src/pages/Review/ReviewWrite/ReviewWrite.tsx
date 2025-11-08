import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useImageInput } from '../../../hooks/useImageInput';
import { useImageUpload } from '../../../hooks/useImageUpload';
import Header from '../../../components/Header';
import { HiddenImageInput, ImageUploader, MemoTextarea, PageContainer, PlaceName, RatingAndTags, TagInput, TagPlaceholder, TagSection, TopSection, UploadedImage, VectorIcon } from './Styles';
import { Rating } from '@smastrom/react-rating';
import Hashtag from '../../../components/Hashtag';
import Button from '../../../components/Button';
import api from '../../../api/api';
import AlertModal from '../../../components/alertmodal/AlertModal';
import HashtagModal from '../../../components/hashtagmodal/HashtagModal';
import profile_image from '../../../assets/profile_image.png';
import vector from '../../../assets/vector.png'

interface Place {
    placeId: number;
    placeName: string;
    placeAddress: string;
    x: number;
    y: number;
}

interface Review {
    placeName: string; // 장소 이름
    address: string, // 장소 주소
    googleId: string, // 구글 장소 id
    xCoordinate: number; // 장소 위도
    yCoordinate: number; // 장소 경도
    rating: number; // 별점
    memo: string; // 메모
    mainTag: string; // 메인태그
    subTags: string[]; // 서브태그
    imageUrl?: string | null; // 이미지경로(supabase)
}

interface Tag {
  text: string;
  backgroundColor: string;
  fontColor: string;
}

const postReview = async (newReview: Review) => { //데이터를 보내는 비동기 함수인 mutationFn
    const { data } = await api.post('/reviews', newReview);
    return data;
}

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

const ReviewWrite: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); //QueryClient불러오기

    //리뷰목록 화면에서 가져와야 하는 항목들(장소 id, 장소 이름, 장소 주소)
    const state = location.state as Place; //가져온 값 타입 설정
    const placeId = state.placeId.toString(); //장소 아이디
    const placeName = state.placeName; //장소 이름
    const placeAddress = state.placeAddress;
    const placeX = state.x //장소 위치
    const placeY = state.y

    const [rating, setRating] = useState(0);
    const [memo, setMemo] = useState('');
    const [mainTag, setMainTag] = useState<Tag | null>(null);
    const [subTags, setSubTags] = useState<Tag[]>([]);
    const {
            previewUrl,
            imageFile,
            //error: imageError, // 필요하다면 에러 처리 추가
            handleImageChange, //label안에 input 있어서 handleimagechange만 줘도 이미지 누르면 파일 탐색기가 뜸
        } = useImageInput(profile_image); // 1. 초기 이미지 뭘로 할지?
    const { uploadImage } = useImageUpload();

    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [activeInput, setActiveInput] = useState<'main' | 'sub' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [tagToColorize, setTagToColorize] = useState<string | null>(null);

    // isOpen: 모달 열림 여부, text: 모달에 표시될 텍스트, onConfirm: 확인 버튼 클릭 시 실행될 함수
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
                // 확인 버튼을 누르면 모달을 닫고, 추가적인 액션이 있으면 실행합니다.
                setAlertModal({ isOpen: false, text: '', buttonText: '확인', onConfirm: () => {} });
                if (onConfirmAction) {
                    onConfirmAction();
                }
            }
        });
    };

    const { mutate: submitReview } = useMutation({ //4. 낙관적 업데이트 적용해 말어?
        mutationFn: postReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', placeId] }); //리뷰 전송하면 리뷰 목록화면에서 리뷰 목록 갱신
            showAlert('리뷰가 성공적으로 등록되었습니다.', () => {
                navigate(-1);
            });
        },
        onError: (error) => {
            console.error('리뷰 등록 실패:', error);
            showAlert('리뷰 등록에 실패했습니다.');
        },
    })

    const { mutate: addTag } = useMutation({
        mutationFn: createTag, // 직접 정의한 함수 사용
        onSuccess: (newTag) => {// new Tag는 응답으로 온 데이터
            if (newTag.color) { // 기존 태그 (색상 값이 있음)
                const tagForState = { text: newTag.hashtag, backgroundColor: newTag.color, fontColor: newTag.fontColor };
                if (activeInput === 'main') {
                    setMainTag(tagForState);
                } else {
                    setSubTags(prev => [...prev, tagForState]);
                }
                resetInputState();
            } else { // 신규 태그 (색상 값이 없음)
                setTagToColorize(newTag.hashtag); // API 응답의 hashtag 속성 사용
                setIsColorModalOpen(true);
            }
        },
        onError: (error) => {
            console.error('태그 생성 실패:', error);
            showAlert('태그를 생성하는 데 실패했습니다.');
            resetInputState();
        }
    });

    const { mutate: patchColor } = useMutation({
        mutationFn: updateTagColor,
        onSuccess: (updatedTag) => { 
            const tagForState = { text: updatedTag.hashtag, backgroundColor: updatedTag.backgroundColor, fontColor: updatedTag.fontColor };
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

    const { mutate: removeMainTagMutation } = useMutation({
    mutationFn: removeMainTag, // [수정] 새로 만든 API 함수 사용
    onSuccess: () => {
        setMainTag(null); // [수정] 성공 시 메인 태그 상태만 null로 변경
    },
    onError: (error) => {
        console.error("메인 태그 삭제 실패:", error); 
        showAlert("메인 태그 삭제에 실패했습니다.");
    }
    });

    const resetInputState = () => {
        setActiveInput(null);
        setInputValue('');
    };

    // [추가] 1. 태그 제출(검증 및 API 호출) 로직을 별도 함수로 분리합니다.
    const handleTagSubmit = () => {
        const text = inputValue.trim();

        // 입력값이 없거나 '#'만 있으면, 경고 없이 그냥 입력창을 닫습니다.
        // (onBlur 시 사용자가 아무것도 입력 안했을 때 경고가 뜨는 것을 방지)
        if (text.length <= 1 || text === '#') {
            resetInputState();
            return;
        }

        // --- 유효성 검사 ---
        // (기존 onKeyDown에 있던 로직과 동일)
        if (!text.startsWith('#')) {
            showAlert('#으로 시작하는 한 글자 이상의 태그를 입력해주세요.');
            resetInputState(); // [수정] 잘못된 입력 시에도 입력창 초기화
            return;
        }
        if (mainTag?.text === text || subTags.some(t => t.text === text)) {
            showAlert('이미 추가된 태그입니다.');
            resetInputState(); // [수정] 중복 시에도 입력창 초기화
            return;
        }

        // 모든 검증 통과 시 태그 생성 API 호출
        // addTag의 onSuccess/onError에서 resetInputState가 호출됩니다.
        addTag(text); 
    };


    // [수정] 2. onKeyDown 핸들러를 수정합니다.
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Form 전송 방지
            // 분리된 태그 제출 함수를 호출합니다.
            handleTagSubmit();
        }
    };

    // [추가] 3. onBlur 핸들러를 새로 만듭니다.
    const handleInputBlur = () => {
        // onKeyDown과 동일하게, 분리된 태그 제출 함수를 호출합니다.
        handleTagSubmit();
    };

    // 모달에서 색상 선택 완료 시 호출
    const handleColorSelect = (backgroundColor: string) => {
        if (tagToColorize) {
            patchColor({ text: tagToColorize, backgroundColor }); // 색상 수정 API 호출
        }
    };

    const handleDeleteTag = (textToDelete: string) => {
    // 삭제하려는 태그가 메인 태그인 경우
    if (mainTag?.text === textToDelete) {
        // placeId를 사용하여 API 호출
        removeMainTagMutation(placeId); 
    } 
    // 삭제하려는 태그가 서브 태그인 경우
    else {
        // 서브 태그는 API 호출 없이 로컬 상태(state)만 변경
        setSubTags(prev => prev.filter(tag => tag.text !== textToDelete));
    }
    };

    
    const handleSubmit = async () => {
        if (!rating || !mainTag) {
            showAlert('별점과 메인 태그는 필수입니다.');
            return;
        }

        let imageUrl: string | null = null;

        // 새 이미지 파일이 있으면 Supabase에 업로드
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                showAlert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                // 업로드 실패 시 전송 중단
                return;
            }
            imageUrl = uploadedUrl;
        }

        // 신규 리뷰 등록
        const review: Review = {
            placeName: placeName,
            address: placeAddress,
            googleId: placeId,
            xCoordinate: placeX,
            yCoordinate: placeY,
            rating: rating,
            mainTag: mainTag.text,
            subTags: subTags.map(t => t.text),
            imageUrl: imageUrl,
            memo: memo,
        };

        submitReview(review); //usemutation으로 리뷰 전송
    };

    return (
        <>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={() => navigate(-1)}
            />

            <PlaceName>
                {placeName}
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
                                <Hashtag text={mainTag.text} backgroundColor={mainTag.backgroundColor} fontColor={mainTag.fontColor} onDelete={handleDeleteTag}/>
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('main'); setInputValue('#')}}>
                                    메인 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>
                        
                        <TagSection>
                            {/* 이미 추가된 서브 태그들 렌더링 */}
                            {subTags.map((tag) => (
                                <Hashtag key={tag.text} text={tag.text} backgroundColor={tag.backgroundColor} fontColor={tag.fontColor} onDelete={handleDeleteTag}/>
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
                    등록하기
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

export default ReviewWrite;