import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMediaUrl } from '../../../common/utils';
import { removeSeries } from '../../../redux/features/media';
import styles from './index.module.scss';

export const SeriesListItem = (props) => {
    //props
    const { series } = props;

    //state
    const [coverUrl, setCoverUrl] = useState(null)

    //store
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.token);
    
    //effects
    useEffect(async () => {
        if (!series.cover_url) return;
        const _url = await getMediaUrl(series.cover_url, token);
        setCoverUrl(_url);
    }, [series.cover_url]);

    //handlers
    const handleDeleteSeries = () => {
        dispatch(removeSeries(series.series_id));
    }

    return (
        <div className={styles.itemWrapper}>
            <img className={styles.cover} src={coverUrl} alt="" />
            {/* <div className={styles.deleteBtn}>
                <img onClick={handleDeleteSeries} src={require("$assets/images/icons/delete.svg")} alt="" />
            </div> */}
            {/* <p>{series.title}</p>
           
            <p>{series.description}</p>
            <p>{series.cover_url}</p>
            <p>{series.trailer_url}</p> */}
            <div className={styles.details}>
                <div>
                    <p>{series.title}</p>
                </div>
            </div>
        </div>
    )
}
