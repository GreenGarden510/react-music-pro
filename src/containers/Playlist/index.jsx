import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '$components/common/Button';
import Row from '$components/media/PlaylistRow';
import TabsMark from '$components/common/TabsMark';

import styles from './index.module.scss';

// options
const options = [
  { name: 'playlist', title: 'Playlist' },
];

const Playlist = () => {
  // state
  const [selected, setSelected] = useState('audio');
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [movies, setMovies] = useState([]);

  // store
  const { id } = useParams();
  const playlists = useSelector((store) => store.playlist.playlists);

  // effects
  useEffect(() => {
    const currentPlaylist = playlists.find((item) => item.playlist_id === id);
    if (currentPlaylist && currentPlaylist.songs) {
      setAudios(currentPlaylist.songs.filter(item => item.category == 'audio'));
      setVideos(currentPlaylist.songs.filter(item => item.category == 'video'));
      setMovies(currentPlaylist.songs.filter(item => item.category == 'movie'));
    }

  }, [playlists, id]);

  // handlers
  const handlePlay = () => {
    console.log('play');
  }

  const handleShuffle = () => {
    console.log('shuffle');
  }

  // handlers
  const handleSelect = (name) => { setSelected(name); }
  console.log('[audio]', audios);

  // render
  return (
    <>
      <div className="mt-5 mr-5">
        <TabsMark
          onSelect={handleSelect}
          selected={selected}
          activeColor="white"
        />
      </div>
      <div style={{clear: 'both'}}></div>
      <div className={styles.wrapper}>
      <div className="d-flex align-items-center mt-4 ml-4">
        <span className={styles.heading}>
          Playlist
        </span>
        </div>
      
        <div className="d-flex justify-content-end align-items-center mt-4">
          <div className="mr-4">
            <Button
              onClick={handlePlay}
              isRed
            >
              Play All
          </Button>
          </div>
          <Button
            onClick={handleShuffle}
            style={styles.shuffleBtn}
            icon="shuffle"
            isCustom
            hideDefault
          >
            Shuffle All
        </Button>
        </div>
        <div className={selected !== 'audio' ? 'd-none' : 'd-flex flex-column'}>
          {
            audios.map((song, idx) => (
              <Row
                key={`song-row-${idx}`}
                name={song.name}
                avatarUrl={song.cover_url}
                artistName={song.composer}
                mediaId={song.media_id}
                mediaUrl={song.media_url}
                recordLabel={song.recordLabel}
                playlistId={id}
              />
            ))
          }
        </div>
        <div className={selected !== 'video' ? 'd-none' : 'd-flex flex-column'}>
          {
            videos.map((song, idx) => (
              <Row
                key={`song-row-${idx}`}
                name={song.name}
                avatarUrl={song.cover_url}
                artistName={song.composer}
                mediaId={song.media_id}
                mediaUrl={song.media_url}
                recordLabel={song.recordLabel}
                playlistId={id}
              />
            ))
          }
        </div>
        <div className={selected !== 'movie' ? 'd-none' : 'd-flex flex-column'}>
          {
            movies.map((song, idx) => (
              <Row
                key={`song-row-${idx}`}
                name={song.name}
                avatarUrl={song.cover_url}
                artistName={song.composer}
                mediaId={song.media_id}
                mediaUrl={song.media_url}
                recordLabel={song.recordLabel}
                playlistId={id}
              />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Playlist;
