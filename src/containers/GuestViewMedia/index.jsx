import React, { useEffect } from 'react'
import Header from '$components/common/Header';
import { useHistory, useParams } from 'react-router-dom';
import { getMedia } from '$redux/features/media'
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from '$components/media/VideoPlayer';
import { routePaths } from '../../common/routeConfig';

const GuestViewMedia = () => {
    //routes
    const { id: mediaId } = useParams();
    const { push } = useHistory()

    //store
    const dispatch = useDispatch();

    const getMediaPending = useSelector((store) => store.media.getMediaPending);
    const getMediaComplete = useSelector((store) => store.media.getMediaComplete);
    const currentMedia = useSelector((store) => store.media.currentMedia);

    //on mount
    useEffect(() => {
        if (!mediaId) {
            return;
        }
        dispatch(getMedia(mediaId));
    }, []);
    if (getMediaComplete) {
        console.log(currentMedia);
    }
    return (
        <div>
            <div className="container">
                <Header></Header>
                <button onClick={() => push(routePaths.marketing)} className="btn btn-secondary mb-2">Back</button>
                {getMediaPending ? <p>Loading...</p> : <></>}
                {getMediaComplete ? (
                    <div className="row">
                        <div className="col-lg-9">
                            <VideoPlayer url={currentMedia.media_url} />
                            <div className="mt-3">
                                <h2>{currentMedia.name}</h2>
                                <div>
                                    <span>{currentMedia.plays} Views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ): <></>}
                
                
            </div>
        </div>
    )
}

export default GuestViewMedia
