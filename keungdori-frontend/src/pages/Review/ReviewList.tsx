import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const ReviewList: React.FC = () => {
    const { placeId } = useParams<{ placeId: string }>();
    const location = useLocation();

    const [placeName, setPlaceName] = useState(location.state?.placeName || '');

    return (
        <div></div>
    );

};

export default ReviewList;