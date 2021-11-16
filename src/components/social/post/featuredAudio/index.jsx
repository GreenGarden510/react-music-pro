import React from 'react'
import Player from '../../../common/Player';
import { SocialMediaAudioPlayer } from '../../audioPlayer';
import styles from './index.module.scss';

export const FeaturedAudioPost = () => {
    return (
        <div className={`${styles.wrapper}`}>
            <div className="my-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe voluptatibus ducimus, ratione facere dolores cum velit vel soluta voluptatum voluptate. Eligendi, atque velit incidunt rerum soluta ducimus doloremque odit iste.
            </div>
            {/* <SocialMediaAudioPlayer /> */}
            <Player />
        </div>
    )
}
