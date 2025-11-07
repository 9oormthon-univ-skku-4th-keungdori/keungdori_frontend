import React from 'react';
import { 
    CardContainer, 
    ImagePlaceholder, 
    Content, 
    PlaceName, 
    TagContainer 
} from './Styles';
import bgImage from '../../assets/keungdori.png';
import RdOnlyHashtag from '../RdOnlyHashtag';

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Place {
    mainTag: Tag;
    subTags: Tag[];
    placeName: string; 
    address: string;
    xcoordinate: number;
    ycoordinate: number;
    distance: number;
}

// 컴포넌트의 props 타입을 정의합니다.
interface PlaceCardProps {
    place: Place;
    onClick?: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
    return (
        <CardContainer onClick={() => onClick && onClick(place)}>
            {/* place.imageUrl이 있으면 배경이미지로 설정, 없으면 기본 플레이스홀더 표시 */}
            <ImagePlaceholder style={{ backgroundImage: bgImage }} />
            <Content>
                <PlaceName>{place.placeName}</PlaceName>
                <TagContainer>
                    {place.mainTag?.hashtag && (
                        <RdOnlyHashtag
                            hashtag={place.mainTag.hashtag}
                            backgroundColor={place.mainTag.backgroundColor}
                            fontColor={place.mainTag.fontColor}
                        />
                    )}
                    {place.subTags.map((tag) => (
                        <RdOnlyHashtag
                            key={tag.hashtag}
                            hashtag={tag.hashtag}
                            backgroundColor={tag.backgroundColor}
                            fontColor={tag.fontColor}
                        />
                    ))}
                </TagContainer>
            </Content>
        </CardContainer>
    );
};

export default PlaceCard;