import React from 'react'
import { PropTypes } from 'prop-types';
import styles from './index.module.scss';
import { round } from 'lodash';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { COLOR_ACCENT } from '$common/constants';
import { COLOR_PRIMARY } from '../../../common/constants';
const DonutProgress = (props) => {
    //props
    const { progress, height, width } = props;

    //const
    return (
        <div style={{ height: height, width: width }}>
            <CircularProgressbar 
                value={progress} 
                text={`${round(progress, 0)}%`}
                styles={buildStyles({
                    pathColor: COLOR_ACCENT,
                    textColor: COLOR_ACCENT,
                })}
            />
        </div>
    )
}

DonutProgress.defaultProps = {
    progress: 0.82,
};
  
DonutProgress.propTypes = {
    process: PropTypes.number,
};
  
export default DonutProgress