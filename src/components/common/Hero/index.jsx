import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '$components/common/Button';
import { showModal } from '$redux/features/modal';

import styles from './index.module.scss';
import { fetchConfigurations, selectConfigurationByKey } from '../../../redux/features/configuration';
import { CONFIG_KEY_HOME_SLIDER } from '../../../containers/Configuration/Sliders/form';
import { fetchSliders, selectAllSliderPictures, selectSliderById } from '../../../redux/features/slider';
import { async } from 'regenerator-runtime';
import { Carousel } from '../Carousel';
import { handleFetch } from '../../../common/requestUtils';

// const audioBkg = require('$assets/images/audio-bkg.png');
// const videoBkg = require('$assets/images/video-bkg.png');

const logo = require('$assets/images/logo.png');
const background = require('$assets/images/background.png');


const HeroWrapper = styled.div`
  clear: both;
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
`;

const Logo = styled.div`
  background-image: url(${logo});
  background-size: 60px 60px;
  background-position: center;
  background-repeat: no-repeat;
  height: 70px;
  width: 70px;
  position: absolute;
  left: 70px;
  top: 2px;
  @media screen and (max-width: 768px) {
    height: 45px;
    width: 45px;
    left: 45px;
    background-size: 45px 45px;
  }
`;

const Hero = (props) => {

  //state
  const [sliderItems, setSliderItems] = useState([])
  const [homeSliderItems, setHomeSliderItems] = useState([])

  // store
  const { visitorToken } = useSelector(state => state.authentication)
  const configuration = useSelector(state => state.configuration)
  const slider = useSelector(state => state.slider)
  const home_slider_setting = useSelector(state => selectConfigurationByKey(state, CONFIG_KEY_HOME_SLIDER))
  const home_slider = useSelector(state => selectSliderById(state, home_slider_setting ? home_slider_setting.value : ""))
  const _homeSliderItems = useSelector(state => selectAllSliderPictures(state, home_slider_setting ? home_slider_setting.value : ""))
  const dispatch = useDispatch();

  //helpers
  const loadImage = async (item) => {
    const res = await handleFetch('GET', `media/presigned-get-url?file_name=${item.image_url}`, null, visitorToken)
    return res.response
  }

  //effects
  useEffect(() => {
    if (visitorToken && configuration.status === 'idle') {
      dispatch(fetchConfigurations())
    }
  }, [configuration, visitorToken])

  useEffect(() => {
    if (home_slider_setting && slider.status === 'idle') {
      dispatch(fetchSliders())
    }
    if (home_slider_setting && slider.status === 'successful') {
      setHomeSliderItems(_homeSliderItems)
    }
  }, [slider, home_slider_setting, _homeSliderItems])

  useEffect(async () => {
    if (homeSliderItems.length) {
      const items = await Promise.all(homeSliderItems.map(async (item) => {
        return loadImage(item)
      }))
      setSliderItems(items)
    }
  }, [homeSliderItems])

  // handlers
  const handlePlay = () => {
    dispatch(showModal('ALERT_MODAL'));
  };

  return (
    <div className={`${styles.sliderWrapper}`}>
      <Carousel items={sliderItems} aspect_ratio_x={home_slider.aspect_ratio_x ?? 6} aspect_ratio_y={home_slider.aspect_ratio_y ?? 2} />
    </div>
  );

};

Hero.defaultProps = {
  source: 'audio',
};

Hero.propTtypes = {
  source: PropTypes.string,
};

export default Hero;