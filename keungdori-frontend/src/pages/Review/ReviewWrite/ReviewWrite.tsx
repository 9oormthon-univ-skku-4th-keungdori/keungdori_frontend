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
import HashtagModal from '../../../components/hashtagmodal/HashtagModal';
import profile_image from '../../../assets/profile_image.png';
import vector from '../../../assets/vector.png'

interface Place {
    placeId: number;
    placeName: string;
    x: number;
    y: number;
}

interface Review {
    placeId: string; //카카오 장소 id
    placeName: string, //장소 이름
    xCoordinate: string; //장소 위도
    yCoordinate: string; //장소 경도
    date: string; //리뷰 작성한 날짜
    rating: number; //별점
    memo: string; //메모
    maintag: string; //메인태그
    subtags: string[]; //서브태그
    imageUrl?: string | null; //이미지경로(supabase)
}

interface Tag {
  text: string;
  bgColor: string;
}

const postReview = async (newReview: Review) => { //데이터를 보내는 비동기 함수인 mutationFn
    const { data } = await api.post('/reviews', newReview);
    return data;
}

const createTag = async (tagText: string) => {
    const { data } = await api.post('/api/hashtags', { hashtag: tagText });
    return data;
};

const updateTagColor = async (variables: { text: string; bgColor: string }) => {
    const { data } = await api.patch('/api/hashtags', { hashtag: variables.text, color: variables.bgColor });
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
    const placeX = state.x.toString(); //장소 위치
    const placeY = state.y.toString();

    const [rating, setRating] = useState(0);
    const [memo, setMemo] = useState('');
    const [mainTag, setMainTag] = useState<Tag | null>(null);
    const [subTags, setSubTags] = useState<Tag[]>([]);
    const {
            previewUrl,
            imageFile,
            error: imageError, // 필요하다면 에러 처리 추가
            handleImageChange, //label안에 input 있어서 handleimagechange만 줘도 이미지 누르면 파일 탐색기가 뜸
        } = useImageInput(profile_image); // 1. 초기 이미지 뭘로 할지?
    const { uploadImage } = useImageUpload();

    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [activeInput, setActiveInput] = useState<'main' | 'sub' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [tagToColorize, setTagToColorize] = useState<string | null>(null);

    const today = new Date(); //리뷰 작성하는 날짜 구하기
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 +1, 한 자릿수면 앞에 '0'을 붙여줌
    const day = today.getDate().toString().padStart(2, '0'); // getDate()도 한 자릿수면 앞에 '0'을 붙여즘
    const reviewDay = `${year}-${month}-${day}`;

    const { mutate: submitReview } = useMutation({ //4. 낙관적 업데이트 적용해 말어?
        mutationFn: postReview,
        onSuccess: () => {
            //alert('리뷰가 성공적으로 등록되었습니다.'); 3. 리뷰 전송 완료 모달
            queryClient.invalidateQueries({ queryKey: ['reviews', placeId] }); //리뷰 전송하면 리뷰 목록화면에서 리뷰 목록 갱신
            navigate(-1); 
        },
        onError: (error) => {
            console.error('리뷰 등록 실패:', error);
            //alert('리뷰 등록에 실패했습니다.'); 3. 리뷰 전송 실패 모달
        },
    })

    const { mutate: addTag } = useMutation({
        mutationFn: createTag, // 직접 정의한 함수 사용
        onSuccess: (newTag) => {// new Tag는 응답으로 온 데이터
            if (newTag.color) { // 기존 태그 (색상 값이 있음)
                const tagForState = { text: newTag.hashtag, bgColor: newTag.color };
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
            alert('태그를 생성하는 데 실패했습니다.');
            resetInputState();
        }
    });

    const { mutate: patchColor } = useMutation({
        mutationFn: updateTagColor,
        onSuccess: (updatedTag) => { 
            const tagForState = { text: updatedTag.hashtag, bgColor: updatedTag.color };
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
            alert('태그 색상을 업데이트하는 데 실패했습니다.');
            setIsColorModalOpen(false);
        }
    });


    const resetInputState = () => {
        setActiveInput(null);
        setInputValue('');
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Form 전송 방지
            const text = inputValue.trim();
            if (!text.startsWith('#') || text.length <= 1) {
                alert('#으로 시작하는 한 글자 이상의 태그를 입력해주세요.');
                return;
            }
            if (mainTag?.text === text || subTags.some(t => t.text === text)) {
                alert('이미 추가된 태그입니다.');
                return;
            }
            addTag(text); // 태그 생성 API 호출
        }
    };

    // 모달에서 색상 선택 완료 시 호출
    const handleColorSelect = (bgColor: string) => {
        if (tagToColorize) {
            patchColor({ text: tagToColorize, bgColor }); // 색상 수정 API 호출
        }
    };
    
    const handleSubmit = async () => {
        if (!rating || !mainTag) {
            //alert('별점과 메인 태그는 필수입니다.'); 2. 모달로 변경
            return;
        }

        let imageUrl: string | null = null;

        // 새 이미지 파일이 있으면 Supabase에 업로드
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                console.error("이미지 업로드에 실패했습니다!");
                // 업로드 실패 시 전송 중단
                return;
            }
            imageUrl = uploadedUrl;
        }

        // 신규 리뷰 등록
        const review: Review = {
            placeName: placeName,
            placeId: placeId,
            xCoordinate: placeX,
            yCoordinate: placeY,
            date: reviewDay,
            rating: rating,
            maintag: mainTag.text,
            subtags: subTags.map(t => t.text),
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
                                    onBlur={resetInputState} 
                                    placeholder="#태그 입력 후 Enter"
                                    autoFocus
                                />
                            ) : mainTag ? (
                                <Hashtag bgColor={mainTag.bgColor}>{mainTag.text}</Hashtag>
                            ) : (
                                <TagPlaceholder onClick={() => { setActiveInput('main'); setInputValue('#')}}>
                                    메인 태그를 추가해주세요.
                                </TagPlaceholder>
                            )}
                        </TagSection>
                        
                        <TagSection>
                            {/* 이미 추가된 서브 태그들 렌더링 */}
                            {subTags.map((tag) => (
                                <Hashtag key={tag.text} bgColor={tag.bgColor}>{tag.text}</Hashtag>
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
        </>
    );
};

export default ReviewWrite;