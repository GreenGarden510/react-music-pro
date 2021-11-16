import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMediaUrl } from '../../../common/utils';
import placeholder from '../../../assets/images/not-found-2.png'
import { COLOR_ACCENT, COLOR_PRIMARY } from '../../../common/constants';
import { generatePath, useHistory } from 'react-router-dom';
import { routePaths } from '../../../common/routeConfig';
import { loadMedia } from '$redux/features/player';

const StyledImage = styled.img`
    height: 50px;
    width: 100%;
    object-fit: cover;
`;

const StyledOwner = styled.p`
    color: ${COLOR_ACCENT};
    cursor: pointer;
`;

export const SimilarMediaItem = (props) => {
    //hooks
    const { push } = useHistory();

    //props
    const { media } = props;

    //state
    const [coverUrl, setCoverUrl] = useState('');

    //store
    const dispatch = useDispatch()
    const token = useSelector((state) => state.authentication.token);

    //effects
    useEffect(async () => {
        if (!media) return;

        if (media.cover_url) {
            if (media.cover_url == 'undefined') return;
            let url = await getMediaUrl(media.cover_url, token);
            setCoverUrl(url);
        }
    }, []);

    const handlePlay = (media) => {
        const mediaId = media.media_id;
        push(generatePath(routePaths.viewMedia, { id: media.media_id }));
    }

    return (
        <div className="row mb-2" onClick={() => handlePlay(media)}>
            <div className="col-5 col-md-5 col-lg-4">
                <StyledImage src={coverUrl ? coverUrl : placeholder} alt="" />
            </div>
            <div className="col-7 col-md-7 col-lg-8">
                <h5>{media.name}</h5>
                <StyledOwner onClick={() => push(generatePath(routePaths.viewArtist, { id: media.owner_id }))}>{media.owner_name}</StyledOwner>
            </div>
        </div>
    )
}
