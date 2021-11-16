import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router-dom'
import { routePaths } from '../../../common/routeConfig';
import { getDuration, getMediaUrl } from '../../../common/utils';
import { getSeries } from '../../../redux/features/media';
import { AddSeriesEpisode } from './addEpisode';
import { SeriesListItem } from './item';
import FeatureHome from '../../../components/common/FeatureHome/index';
import { EpisodeItem } from './episodeItem';

const initialEpisode = {
    file: null,
    filename: null, 
    name: null,
    description: null,
    cover_url: null,
    duration: null,
    category: 'episode',
    starting_date: null,
    owner_id: null,
    media_url: null,
    series_id: null,
    genres: [],
}

export const ManageSeriesProfile = (props) => {
    //props

    //hooks
    const { series_id } = useParams();
    const { push } = useHistory();

    //refs
    const fileRef = useRef(null);

    //state
    const [series, setSeries] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    //store
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.authentication);
    const mySeries = useSelector(state => state.media.mySeries);
    const getSeriesPending = useSelector(state => state.media.getSeriesPending);
    const getSeriesSuccess = useSelector(state => state.media.getSeriesSuccess);

    //effects
    useEffect(() => {
        if (!mySeries.length) dispatch(getSeries())
    }, []);

    useEffect(() => {
        if (!series_id) return;
        if (mySeries.some(_series => _series.series_id == series_id)) {
            setSeries(mySeries.find(_series => _series.series_id == series_id));
        }
    }, [series_id, getSeriesSuccess])
    
    //handlers
    const handleManageSeries = (series_id) => {
        console.log("Handling manage series");
        console.log(series_id);
        push(generatePath(routePaths.manageSeries, { 'series_id': series_id } ))
    }

    const handleAddEpisodesChanged = async () => {
        //get the files
        const files = fileRef.current.files;
        console.log(files);
        //initialize the payload & patch it up
        const payload = {
            ...initialEpisode,
            owner_id: user.user_id,
            series_id: series.series_id,
            cover_url: series.cover_url,
        };

        //loop and append
        let _episodes = episodes;
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file.name);
            console.log(_episodes);
            //search if the file is not in the array already
            if (!_episodes.some(ep => ep.filename == file.name)) {
                //get duration
                const duration = new Promise((resolve, reject) => {
                    console.log("Trying to get the duration");
                    try {
                        getDuration(file, 'video', (duration) => {
                            console.log("Obtained the duration ", duration);
                            resolve(duration)
                        });
                    } catch (e) {
                        console.error(e);
                        reject(e);
                    }
                })

                _episodes = [
                    ..._episodes, 
                    {
                        ...payload,
                        file: file,
                        filename: file.name,
                        duration: await duration,
                    }
                ];
            }
        }
        setEpisodes(_episodes);
    }

    const handleAddEpisodeComplete = (filename) => {
        setEpisodes(episodes.filter(ep => ep.filename != filename));
    }

    return (
        <div className="container mt-5">
            <div className="row pt-5">
                <div className="col-lg-9">
                    <h1 className="text-light">{series ? series.title : 'My Series'}</h1>
                    {series ? <p>Has {series.episodes.length} episodes</p> : ''}
                </div>
                {series && (
                    <div className="col-lg-3">
                        <button onClick={() => fileRef.current.click()} className="btn btn-lg btn-primary w-100">Add Episodes</button>
                        <input ref={fileRef} className="d-none" type="file" accept="video/*,.mkv" multiple onChange={handleAddEpisodesChanged} />
                    </div>
                )}
            </div>
            
            {/* Showing a list of Series */}
            {!series && (
                <div className="row">
                    {getSeriesPending && <p>Loading...</p>}
                    <div className="d-flex">
                        {mySeries.map(_series => <div onClick={() => handleManageSeries(_series.series_id)} className="mr-2"><SeriesListItem series={_series} /></div>)}
                    </div>
                </div>
            )}

            {/* Managing a Series Profile */}
            {series && (
                <>
                    <div className="mt-3">
                        {episodes.map(ep => (
                            <div className="mb-2">
                                <AddSeriesEpisode key={ep.filename} episode={ep} onComplete={() => handleAddEpisodeComplete(ep.filename)} />
                            </div>
                        ))}
                    </div>

                    <div className="d-flex">
                        {series.episodes.map(episode => (
                            <div className="mr-3">
                                <EpisodeItem episode={episode} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}