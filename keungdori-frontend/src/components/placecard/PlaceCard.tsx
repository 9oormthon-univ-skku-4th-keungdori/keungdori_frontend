import React from 'react';
import { 
    CardContainer, 
    ImagePlaceholder, 
    Content, 
    PlaceName, 
    TagContainer 
} from './Styles';
import bgImage from '../../assets/keungdori.png';
//import RdOnlyHashtag from '../RdOnlyHashtag';

// Search.tsx의 ReviewedPlace 인터페이스와 맞춰주세요.
interface Place {
    placeId: number;
    placeName: string;
    address: string;
    googleId: string;
    xcoordinate: number;
    ycoordinate: number;
}

// 컴포넌트의 props 타입을 정의합니다.
interface PlaceCardProps {
    place: Place;
    onClick: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
    return (
        <CardContainer onClick={() => onClick(place)}>
            {/* place.imageUrl이 있으면 배경이미지로 설정, 없으면 기본 플레이스홀더 표시 */}
            <ImagePlaceholder style={{ backgroundImage: bgImage }} />
            <Content>
                <PlaceName>{place.placeName}</PlaceName>
                <TagContainer>
                </TagContainer>
            </Content>
        </CardContainer>
    );
};

export default PlaceCard;